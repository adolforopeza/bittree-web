// src/core/database.ts
/**
 * Cliente Supabase optimizado y acceso directo a datos mediante RPC.
 */
import { createClient } from '@supabase/supabase-js';
import { env } from './env';
import type { Locale } from './i18n';
import { remember } from './cache';

if (!env.isServer) {
    throw new Error('Database operations must be executed on the server');
}

const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
    db: { schema: env.supabaseSchema },
    auth: { persistSession: false, autoRefreshToken: false },
});

export interface ProfileLocalization {
    title: string;
    description: string;
}

export interface ProfileI18nData {
    keywords?: string[];
    lang?: Record<string, ProfileLocalization>;
}

export interface ProfileLink {
    entity_id: string;
    link_json: {
        url: string;
        lang: Record<string, {
            title: string;
            subtitle?: string;
            badge?: string;
        }>;
        variants?: {
            isPrimary?: boolean;
            openInNewWindow?: boolean;
            seoTarget?: string;
            seoRel?: string;
            downloadDirect?: boolean;
        };
    };
    icon: string;
    position: number;
    clicks: number;
}

export interface Profile {
    entity_id: string;
    username: string;
    full_name: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    profile_data_json?: ProfileI18nData;
    settings?: Record<string, unknown>;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    links?: ProfileLink[];
}

export interface ResolvedProfile extends Profile {
    current_locale: string;
    resolved_title: string;
    resolved_description: string;
    resolved_keywords: string[];
}

/**
 * Recupera el perfil completo utilizando la función RPC get_profile.
 */
const configuredTtlSeconds = Number(process.env.PROFILE_CACHE_TTL_SECONDS || 300);
const PROFILE_CACHE_TTL_MS = Number.isFinite(configuredTtlSeconds) && configuredTtlSeconds > 0
    ? configuredTtlSeconds * 1000
    : 300_000;

const profileCache = new Map<string, {
    expiresAt: number;
    value: Profile | null;
}>();
const profileRequests = new Map<string, Promise<Profile | null>>();

async function fetchProfile(username?: string): Promise<Profile | null> {
    const target = username || env.userName;
    
    const { data, error } = await supabase.rpc('get_profile', {
        user_name: target
    });

    if (error) {
        console.error(`[DB_ERROR] Error calling get_profile: ${error.message}`);
        throw new Error(`Unable to load profile: ${error.message}`);
    }

    let profile: Profile | null = null;
    if (data) {
        if (Array.isArray(data)) {
            profile = data[0] || null;
        } else {
            profile = data as Profile;
        }
    }

    return profile;
}

async function loadProfile(username?: string): Promise<Profile | null> {
    const key = username || env.userName;
    const now = Date.now();

    const cached = profileCache.get(key);
    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    const pending = profileRequests.get(key);
    if (pending) {
        return pending;
    }

    const request = fetchProfile(username)
        .then((profile) => {
            profileCache.set(key, {
                expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
                value: profile,
            });
            return profile;
        })
        .finally(() => {
            profileRequests.delete(key);
        });

    profileRequests.set(key, request);
    return request;
}

export const getProfile = remember(loadProfile);

export interface ProfileSummary {
    username: string;
    full_name: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
}

export const getProfileSummary = remember(async (): Promise<ProfileSummary | null> => {
    const profile = await getProfile();
    if (!profile) return null;

    return {
        username: profile.username,
        full_name: profile.full_name,
        headline: profile.headline,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
    };
});

interface ProfileUsernameRow {
    username: string;
    is_active: boolean;
}

/**
 * Obtiene los perfiles publicados para generar rutas indexables.
 * Esta consulta se ejecuta únicamente con el cliente server-only configurado arriba.
 */
export const getProfileUsernames = remember(async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('username, is_active')
        .eq('is_active', true)
        .not('username', 'is', null);

    if (error) {
        console.error(`[DB_ERROR] Error loading profile usernames: ${error.message}`);
        throw new Error(`Unable to load profile usernames: ${error.message}`);
    }

    return ((data || []) as ProfileUsernameRow[])
        .map(({ username }) => username.trim())
        .filter(Boolean);
});

const socialHosts = {
    github: 'github.com',
    linkedin: 'linkedin.com',
    youtube: 'youtube.com',
    instagram: 'instagram.com',
} as const;

type SocialHost = (typeof socialHosts)[keyof typeof socialHosts];

/**
 * Devuelve sólo URLs HTTPS de perfiles en las redes sociales soportadas.
 * No se incluyen enlaces arbitrarios para evitar asociar identidades incorrectas.
 */
export function getProfileSocialUrls(profile: Profile): string[] {
    const urls = new Set<string>();

    for (const link of profile.links || []) {
        const rawUrl = link.link_json?.url;
        if (typeof rawUrl !== 'string') continue;

        try {
            const url = new URL(rawUrl);
            if (url.protocol !== 'https:') continue;

            const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
            const isSupportedHost = (Object.values(socialHosts) as SocialHost[])
                .some((host) => hostname === host);

            if (isSupportedHost) {
                urls.add(url.toString());
            }
        } catch {
            // Los enlaces inválidos no forman parte de la identidad estructurada.
        }
    }

    return [...urls];
}

/**
 * Resuelve la localización del perfil para el idioma solicitado.
 */
export function resolveProfileLocale(profile: Profile, lang: Locale): ResolvedProfile {
    if (!profile) return profile as unknown as ResolvedProfile;
    const profileData = profile.profile_data_json || {};

    const langMap = profileData.lang || {};
    const localized = langMap[lang] || langMap['es'] || Object.values(langMap)[0];
    return {
        ...profile,
        bio: localized?.description || '',
        current_locale: lang,
        resolved_title: localized.title || '',
        resolved_description: localized.description || '',
        resolved_keywords: profileData.keywords || [],
    };
}
