// src/core/database/links/types.ts

/**
 * Atributos de localización específicos para un enlace individual.
 */
export interface LinkLocalization {
    title: string;
    subtitle?: string;
    badge?: string;
}

/**
 * Variantes de comportamiento e interacción técnica para los enlaces.
 */
export interface LinkVariants {
    openInNewWindow: boolean;
    downloadDirect: boolean;
    isPrimary: boolean;
    seoRel: string;
    seoTarget: string;
}

/**
 * Estructura interna de los datos JSON del enlace almacenados en base de datos.
 */
export interface LinkJsonPayload {
    url: string;
    variants: LinkVariants;
    lang: Record<string, LinkLocalization>;
}

/**
 * Representa la entidad de enlace individual dentro del esquema de base de datos.
 */
export interface Link {
    entity_id: string;
    profile_id: string;
    link_json: LinkJsonPayload;
    icon: string;
    position: number;
    clicks: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Parámetros requeridos para el procedimiento almacenado RPC 'set_link' (Creación y Actualización).
 */
export interface SetLinkParams {
    entity_id?: string;
    profile_id: string;
    link_json: LinkJsonPayload;
    icon: string;
    position: number;
    clicks?: number;
    is_active?: boolean;
}

/**
 * Parámetros requeridos para el procedimiento almacenado RPC 'delete_link'.
 */
export interface DeleteLinkParams {
    entity_id: string;
}

/**
 * Estructura de respuesta tipada para las operaciones de base de datos en enlaces.
 */
export interface LinkDatabaseResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}