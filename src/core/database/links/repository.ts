// src/core/database/links/repository.ts
import { createServerClient } from '@/core/database/supabase.server';
import type {
    Link,
    SetLinkParams,
    DeleteLinkParams,
    LinkDatabaseResponse,
} from '@/core/database/links/types';

/**
 * Repositorio de persistencia y consultas RPC para la entidad Link.
 */
export class LinkRepository {
    /**
     * Obtiene todos los enlaces asociados a un perfil específico mediante la función RPC 'get_links_by_profile'.
     */
    public static async getLinksByProfileId(profileId: string): Promise<LinkDatabaseResponse<Link[]>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('get_links_by_profile', { p_profile_id: profileId });

            if (error) {
                return { data: null, error: error.message, success: false };
            }

            // Normalización defensiva: si el resultado viene envuelto en un objeto o estructura anidada de Supabase RPC, se extrae correctamente.
            const linksArray = Array.isArray(data) ? data : (data as any)?.data || [];

            return { data: linksArray as Link[], error: null, success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown database error occurred';
            return { data: null, error: message, success: false };
        }
    }

    /**
     * Inserta o actualiza un enlace mediante la función RPC 'set_link'.
     */
    public static async setLink(params: SetLinkParams): Promise<LinkDatabaseResponse<unknown>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('set_link', params);

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
     * Elimina un enlace específico mediante la función RPC 'delete_link'.
     */
    public static async deleteLink(params: DeleteLinkParams): Promise<LinkDatabaseResponse<unknown>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('delete_link', params);

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
