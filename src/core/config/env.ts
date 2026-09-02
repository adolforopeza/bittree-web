// src/core/config/env.ts

/**
 * Validates the presence and format of critical environment variables strictly.
 * Prevents security flaws and ensures Supabase URLs are valid before client initialization.
 */
const validateEnv = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const adminSlug = process.env.ADMIN_SLUG;
    const adminAllowedEmail = process.env.ADMIN_ALLOWED_EMAIL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseSchema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA;

    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
        throw new Error(
            `[Security Critical] NEXT_PUBLIC_SUPABASE_URL is not defined or is not a valid HTTP/HTTPS URL: "${supabaseUrl}". Verify your .env.local file.`
        );
    }

    if (!supabaseAnonKey) {
        throw new Error(
            "[Security Critical] The NEXT_PUBLIC_SUPABASE_ANON_KEY variable is missing."
        );
    }

    if (!adminSlug) {
        throw new Error(
            "[Security Critical] The ADMIN_SLUG variable is not defined."
        );
    }

    if (!adminAllowedEmail) {
        throw new Error(
            "[Security Critical] The ADMIN_ALLOWED_EMAIL variable is not configured."
        );
    }

    if (!supabaseServiceRoleKey) {
        throw new Error(
            "[Security Critical] The SUPABASE_SERVICE_ROLE_KEY variable is not configured."
        );
    }

    if (!supabaseSchema) {
        throw new Error(
            "[Security Critical] The NEXT_PUBLIC_SUPABASE_SCHEMA variable is not configured."
        );
    }

    return Object.freeze({
        supabaseUrl,
        supabaseAnonKey,
        supabaseSchema,
        adminSlug,
        adminAllowedEmail,
        supabaseServiceRoleKey,
    });
};

export const env = validateEnv();