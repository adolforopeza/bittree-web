// src/core/database/supabase-client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient as createSsrServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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
                    schema: env.supabaseSchema,
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
 * Fábrica de cliente Supabase para Server Components, Server Actions y Rutas API.
 */
// @ts-ignore
export const createServerClient = async (): Promise<SupabaseClient<any, any, any>> => {
    try {
        const cookieStore = await cookies();

        const client = createSsrServerClient(env.supabaseUrl, env.supabaseAnonKey, {
            db: {
                schema: env.supabaseSchema,
            },
            cookies: {
                getAll() {
                    try {
                        return cookieStore.getAll();
                    } catch {
                        return [];
                    }
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {}
                },
            },
        });
        return client as any;
    } catch {
        return {} as any;
    }
};

/**
 * Cliente Supabase con privilegios elevados (Service Role) estrictamente para backend.
 * Falla de forma intencional si no detecta la clave de servicio para evitar caídas silenciosas de seguridad.
 */
// @ts-ignore
export const createAdminClient = (): SupabaseClient<any, any, any> => {
    try {
        const serviceRoleKey = env.supabaseServiceRoleKey;

        if (!serviceRoleKey) {
            throw new Error('[CRITICAL_SECURITY] SUPABASE_SERVICE_ROLE_KEY no está configurada en las variables de entorno.');
        }

        const client = createClient(env.supabaseUrl, serviceRoleKey, {
            db: {
                schema: env.supabaseSchema,
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