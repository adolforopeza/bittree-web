// src/core/config/env.server.ts

if (typeof window !== 'undefined') {
  throw new Error('src/core/config/env.server.ts should not be imported from client-side code');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public';
const adminSlug = process.env.ADMIN_SLUG || 'backend-secreto';
const adminAllowedEmailsCsv = process.env.ADMIN_ALLOWED_EMAILS || process.env.ADMIN_ALLOWED_EMAIL || '';
const adminAllowedEmails = adminAllowedEmailsCsv
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('[Security Critical] NEXT_PUBLIC_SUPABASE_URL is not defined or invalid');
}

if (!supabaseAnonKey) {
  throw new Error('[Security Critical] NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
}

if (!supabaseServiceRoleKey) {
  // For deployments where service role is not provided, this will throw so code using admin client fails fast.
  throw new Error('[Security Critical] SUPABASE_SERVICE_ROLE_KEY is not defined in server environment');
}

export const serverEnv = Object.freeze({
  supabaseUrl,
  supabaseAnonKey,
  supabaseSchema,
  adminSlug,
  adminAllowedEmails,
  supabaseServiceRoleKey,
});
