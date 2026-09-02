// src/core/database/profiles/types.ts

/**
 * Representa la metadata localizada por idioma en el perfil.
 */
export interface ProfileLocalization {
    title: string;
    description: string;
}

/**
 * Contenedor de localizaciones e idiomas para el perfil.
 */
export interface ProfileI18nData {
    keywords?: string[];
    lang?: Record<string, ProfileLocalization>;
}

/**
 * Representa un enlace individual asociado al perfil.
 */
export interface ProfileLink {
    entity_id: string;
    link_json: Record<string, { url: string; title: string }>;
    icon: string;
    position: number;
    clicks: number;
}

/**
 * Representa la entidad de perfil de usuario dentro del esquema de base de datos.
 */
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

/**
 * Perfil procesado con datos resueltos para un idioma específico (vistas/templates).
 */
export interface ResolvedProfile extends Omit<Profile, 'profile_data_json'> {
    current_locale: string;
    resolved_title: string;
    resolved_description: string;
    resolved_keywords: string[];
    profile_data_json?: ProfileI18nData;
    links?: ProfileLink[];
}

/**
 * Parámetros requeridos para el procedimiento almacenado RPC 'set_profile' (Creación y Actualización).
 */
export interface SetProfileParams {
    entity_id?: string;
    username?: string;
    full_name?: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    profile_data_json?: ProfileI18nData;
    settings?: Record<string, unknown>;
    is_active?: boolean;
}

/**
 * Parámetros requeridos para el procedimiento almacenado RPC 'delete_profile'.
 */
export interface DeleteProfileParams {
    entity_id: string;
}

/**
 * Estructura de respuesta tipada para las operaciones de base de datos en perfiles.
 */
export interface ProfileDatabaseResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}