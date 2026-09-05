// src/core/database/supabase.server.ts

if (typeof window !== 'undefined') {
  throw new Error('src/core/database/supabase.server.ts must not be imported from client');
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { serverEnv } from '@/core/config/env.server';

/**
 * Server-only Supabase client factory. Use this for RPCs and server operations.
 */
export const createServerClient = async (): Promise<SupabaseClient<any, any, any>> => {
  if (typeof window !== 'undefined') {
    throw new Error('[CRITICAL_SECURITY] createServerClient must not be called in the browser.');
  }

  const serviceRoleKey = serverEnv.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = serverEnv.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSchema = serverEnv.supabaseSchema || process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public';

  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error('[CRITICAL_SECURITY] SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not configured.');
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    db: { schema: supabaseSchema },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
};

/**
 * Admin client with elevated privileges (Service Role). Only for backend use.
 */
export const createAdminClient = (): SupabaseClient<any, any, any> => {
  const serviceRoleKey = serverEnv.supabaseServiceRoleKey;
  const supabaseSchema = serverEnv.supabaseSchema || 'public';

  if (!serviceRoleKey) {
    throw new Error('[CRITICAL_SECURITY] SUPABASE_SERVICE_ROLE_KEY not configured in server env.');
  }

  const client = createClient(serverEnv.supabaseUrl, serviceRoleKey, {
    db: { schema: supabaseSchema },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client as any;
};
