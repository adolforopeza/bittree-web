// src/core/database/supabase-client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/core/config/env';

/**
 * Singleton global de cliente Supabase del lado del cliente (Client Component / Browser).
 */
// @ts-ignore
let browserClient: SupabaseClient<any, any, any> | null = null;

// @ts-ignore
export const getSupabaseBrowserClient = (): SupabaseClient<any, any, any> => {
    try {
        if (!browserClient) {
            browserClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
                db: {
                    schema: process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public',
                },
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                },
            });
        }
        return browserClient as any;
    } catch {
        return {} as any;
    }
};

/**
 * Cliente de servidor Supabase utilizando Service Role y esquema configurado en NEXT_PUBLIC_SUPABASE_SCHEMA[cite: 22].
 */
export const createServerClient = async (): Promise<SupabaseClient<any, any, any>> => {
    try {
        if (typeof window !== 'undefined') {
            throw new Error('[CRITICAL_SECURITY] createServerClient must not be called in the browser.');
        }
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public';

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('[CRITICAL_SECURITY] SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL no están configuradas.');
        }

        const client = createClient(supabaseUrl, serviceRoleKey, {
            db: { schema: supabaseSchema },
            auth: { persistSession: false, autoRefreshToken: false },
        });

        return client;
    } catch {
        return {} as any;
    }
};

/**
 * Cliente Supabase con privilegios elevados (Service Role) estrictamente para backend.
 */
// @ts-ignore
export const createAdminClient = (): SupabaseClient<any, any, any> => {
    try {
        const serviceRoleKey = env.supabaseServiceRoleKey;
        const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public';

        if (!serviceRoleKey) {
            throw new Error('[CRITICAL_SECURITY] SUPABASE_SERVICE_ROLE_KEY no está configurada en las variables de entorno.');
        }

        const client = createClient(env.supabaseUrl, serviceRoleKey, {
            db: {
                schema: supabaseSchema,
            },
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
        return client as any;
    } catch (error: any) {
        console.error(error.message);
        return {} as any;
    }
};