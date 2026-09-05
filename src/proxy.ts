// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient as createSupabaseSsrClient } from '@supabase/ssr';
import { serverEnv } from '@/core/config/env.server';
import { i18n } from '@/core/i18n/config';
import { buildCspString } from '@/core/security/csp/buildCsp';

// Cache per-edge-instance (for CSP)
declare global {
  var __CSP_CACHE__: { value: string; expiresAt: number } | undefined;
}

const CACHE_TTL_SECONDS = 60; // keep short but effective
const PUBLIC_CSP_ENDPOINT = '/api/public/csp';

/**
 * Intercepts network traffic at the edge, enforcing language prefix validation, redirection, and administrative security controls.
 * Also applies dynamic CSP header fetched from /api/public/csp with in-memory caching per instance.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const currentPath = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !currentPath.startsWith(`/${locale}/`) && currentPath !== `/${locale}`
  );

  const adminSlug = serverEnv.adminSlug;
  const isAdminRoute = currentPath.startsWith('/backend') || currentPath.startsWith(`/${adminSlug}`);

  if (pathnameIsMissingLocale && !isAdminRoute && !currentPath.startsWith('/api')) {
    const locale = i18n.defaultLocale;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${currentPath === '/' ? '' : currentPath}`;
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = createSupabaseSsrClient(serverEnv.supabaseUrl, serverEnv.supabaseAnonKey, {
    db: {
      schema: serverEnv.supabaseSchema,
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = `/${adminSlug}/login`;
      return NextResponse.redirect(loginUrl);
    }
    const allowedAdminEmails = serverEnv.adminAllowedEmails || [];
    const userEmail = (user?.email || '').toLowerCase();
    if (!allowedAdminEmails.includes(userEmail)) {
      await supabase.auth.signOut();
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = `/${i18n.defaultLocale}`;
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // CSP handling: try cache first
  try {
    const now = Date.now();
    if (global.__CSP_CACHE__ && global.__CSP_CACHE__.expiresAt > now) {
      supabaseResponse.headers.set('Content-Security-Policy', global.__CSP_CACHE__.value);
      return supabaseResponse;
    }

    const origin = request.nextUrl.origin;
    const cfgRes = await fetch(origin + PUBLIC_CSP_ENDPOINT, { cache: 'no-store' });
    let cspString = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'";
    if (cfgRes.ok) {
      const body = await cfgRes.json();
      const cfg = body?.config || {};
      cspString = buildCspString(cfg) || cspString;
    }

    global.__CSP_CACHE__ = { value: cspString, expiresAt: now + CACHE_TTL_SECONDS * 1000 };
    supabaseResponse.headers.set('Content-Security-Policy', cspString);
    return supabaseResponse;
  } catch (e) {
    const fallback = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'";
    supabaseResponse.headers.set('Content-Security-Policy', fallback);
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.*|robots.txt).*)',
  ],
};
