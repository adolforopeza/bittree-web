// src/core/database/supabase-client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { clientEnv } from '@/core/config/env.client';

/**
 * Client (browser) Supabase client singleton. This file is safe to bundle in browser code.
 */
let browserClient: SupabaseClient<any, any, any> | null = null;

export const getSupabaseBrowserClient = (): SupabaseClient<any, any, any> => {
  if (!browserClient) {
    if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
      throw new Error('[Security] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in client env');
    }

    browserClient = createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey, {
      db: { schema: clientEnv.supabaseSchema },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient as any;
};
