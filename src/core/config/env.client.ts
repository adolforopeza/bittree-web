// src/core/config/env.client.ts

// Client-safe environment values. Import this from browser-only code.
export const clientEnv = Object.freeze({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseSchema: process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public',
  adminSlug: process.env.ADMIN_SLUG || 'backend-secreto',
});
