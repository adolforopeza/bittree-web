// src/core/database/profiles/repository.ts
import { createServerClient } from '@/core/database/supabase-client';
import type { Profile, ResolvedProfile } from './types';
import type { Locale } from '@/core/i18n/config';

export type ProfileRepositoryResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * Repositorio centralizado para la gestión de perfiles e identidades digitales,
 * utilizando estrictamente las funciones RPC oficiales de Supabase (get_profile, set_profile, delete_profile)
 * y enrutando automáticamente entre HTTP GET (para lectura con prefijo get_) y POST (para mutaciones).
 */
export class ProfileRepository {
    private static async executeRpc<T>(
        functionName: string,
        params?: Record<string, any>
    ): Promise<ProfileRepositoryResponse<T>> {
        try {
            const supabase = await createServerClient();
            const isGet = functionName.startsWith('get_');
            const options = isGet ? { get: true } : {};

            const { data, error } = await supabase.rpc(functionName, params || {}, options);
            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, data: data as T };
        } catch (err: any) {
            return { success: false, error: err?.message || 'Error desconocido en repositorio' };
        }
    }

    public static async getProfiles(username?: string): Promise<ProfileRepositoryResponse<Profile[]>> {
        const payload = username ? { user_name: username } : {};
        const response = await this.executeRpc<Profile | Profile[] | null>('get_profile', payload);

        if (!response.success) {
            return { success: false, error: response.error };
        }

        let profiles: Profile[] = [];
        if (response.data) {
            profiles = Array.isArray(response.data) ? response.data : [response.data];
        }

        return { success: true, data: profiles };
    }

    public static async getResolvedProfileByUsername(username: string, lang: Locale): Promise<ResolvedProfile | null> {
        const response = await this.getProfiles(username);
        if (!response.success || !response.data || response.data.length === 0) {
            return null;
        }
        return this.resolveProfileLocale(response.data[0], lang);
    }

    public static async setProfile(profileData: Partial<Profile>): Promise<ProfileRepositoryResponse<Profile>> {
        return this.executeRpc<Profile>('set_profile', { p_profile: profileData });
    }

    public static async deleteProfile(profileId: string): Promise<ProfileRepositoryResponse<boolean>> {
        const response = await this.executeRpc<any>('delete_profile', { p_id: profileId });
        if (!response.success) {
            return { success: false, error: response.error };
        }
        return { success: true, data: true };
    }

    public static resolveProfileLocale(profile: Profile, lang: Locale): ResolvedProfile {
        if (!profile) return profile as unknown as ResolvedProfile;
        const bioData = (profile as any).bio_json;
        const localizedBio = bioData?.[lang] || bioData?.['es'] || profile.bio;

        return {
            ...profile,
            bio: typeof localizedBio === 'string' ? localizedBio : profile.bio,
            current_locale: lang,
            resolved_title: profile.full_name,
            resolved_description: profile.headline || profile.bio || '',
            resolved_keywords: ['portfolio', profile.username],
        };
    }
}