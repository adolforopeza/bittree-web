// src/core/env.ts
/**
 * Configuración centralizada de variables de entorno con validación estricta.
 */

const isServer = typeof window === 'undefined';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const userName = process.env.USER_NAME || '';
const nodeEnv = process.env.NODE_ENV || '';

if (!supabaseUrl || !/^https:\/\/.+/.test(supabaseUrl)) {
    throw new Error('[SECURITY] NEXT_PUBLIC_SUPABASE_URL is missing or invalid');
}

if (isServer && !serviceRoleKey) {
    throw new Error('[SECURITY] SUPABASE_SERVICE_ROLE_KEY is missing on server');
}

export const env = Object.freeze({
    supabaseUrl,
    supabaseAnonKey,
    supabaseSchema,
    serviceRoleKey,
    userName,
    isServer,
    nodeEnv
});
