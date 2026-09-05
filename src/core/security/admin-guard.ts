// src/core/security/admin-guard.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { serverEnv } from '@/core/config/env.server';

export async function validateAdminAccess(supabase: SupabaseClient): Promise<boolean> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email || !user.email_confirmed_at) {
    return false;
  }

  const allowedEmails = serverEnv.adminAllowedEmails || [];
  const userEmail = (user.email || '').toLowerCase();

  if (!allowedEmails.includes(userEmail)) {
    await supabase.auth.signOut();
    return false;
  }

  return true;
}
