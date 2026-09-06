// modules/profile/server/linksRepository.ts
import { createServerClient } from '@/core/database/supabase.server';
import type {
    Link,
    SetLinkParams,
    DeleteLinkParams,
    LinkDatabaseResponse,
} from '@/core/database/links/types';

export class LinkRepository {
    public static async getLinksByProfileId(profileId: string): Promise<LinkDatabaseResponse<Link[]>> {
        try {
            const client = await createServerClient();
            const { data, error } = await client.rpc('get_links_by_profile', { p_profile_id: profileId });

            if (error) {
                return { data: null, error: error.message, success: false };
            }

            const linksArray = Array.isArray(data) ? data : (data as any)?.data || [];

            return { data: linksArray as Link[], error: null, success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown database error occurred';
            return { data: null, error: message, success: false };
        }
    }

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
