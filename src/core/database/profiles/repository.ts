// src/core/database/profiles/repository.ts
import { createServerClient } from '@/core/database/supabase-client';
import type {
    Profile,
    ResolvedProfile,
    SetProfileParams,
    DeleteProfileParams,
    ProfileDatabaseResponse,
} from '@/core/database/profiles/types';

/**
 * Repositorio de persistencia, procesamiento i18n y consultas RPC optimizadas para la entidad Profile.
 */
export class ProfileRepository {
    /**
     * Preprocesa un perfil crudo de base de datos resolviendo los campos localizados según el idioma indicado.
     */
    public static resolveProfileLocale(profile: Profile, locale: string = 'es'): ResolvedProfile {
        const profileData = profile.profile_data_json || {};
        const langMap = profileData.lang || {};
        const localized = langMap[locale] || langMap['es'] || Object.values(langMap)[0];

        return {
            ...profile,
            current_locale: locale,
            resolved_title: localized?.title || profile.full_name,
            resolved_description: localized?.description || profile.bio || '',
            resolved_keywords: profileData.keywords || [],
        };
    }

    /**
     * Obtiene una lista de perfiles filtrada por user_name opcional mediante la función RPC 'get_profile'.
     */
    public static async getProfiles(user_name?: string): Promise<ProfileDatabaseResponse<Profile[]>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('get_profile', {
                ...(user_name ? { user_name } : {})
            });

            if (error) {
                return { data: null, error: error.message, success: false };
            }

            return { data: data as Profile[], error: null, success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown database error occurred';
            return { data: null, error: message, success: false };
        }
    }

    /**
     * Obtiene un perfil específico optimizado mediante user_name obligatorio y adaptado al idioma requerido.
     */
    public static async getResolvedProfileByUsername(user_name: string, locale: string = 'es'): Promise<ProfileDatabaseResponse<ResolvedProfile>> {
        if (!user_name || user_name.trim() === '') {
            return { data: null, error: 'Username is required', success: false };
        }

        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('get_profile', { user_name });

            if (error) {
                return { data: null, error: error.message, success: false };
            }

            const profiles = (data as Profile[]) || [];
            const target = profiles[0];

            if (!target) {
                return { data: null, error: 'Profile not found', success: false };
            }

            const resolved = this.resolveProfileLocale(target, locale);
            return { data: resolved, error: null, success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown database error occurred';
            return { data: null, error: message, success: false };
        }
    }

    /**
     * Inserta o actualiza un perfil mediante la función RPC 'set_profile'.
     */
    public static async setProfile(params: SetProfileParams): Promise<ProfileDatabaseResponse<unknown>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('set_profile', params);

            if (error) {
                return { data: null, error: error.message, success: false };
            }

            return { data, error: null, success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown database error occurred';
            return { data: null, error: message, success: false };
        }
    }

    /**
     * Elimina un perfil específico mediante la función RPC 'delete_profile'.
     */
    public static async deleteProfile(params: DeleteProfileParams): Promise<ProfileDatabaseResponse<unknown>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('delete_profile', params);

            if (error) {
                return { data: null, error: error.message, success: false };
            }

            return { data, error: null, success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown database error occurred';
            return { data: null, error: message, success: false };
        }
    }
}