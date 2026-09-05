// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildCspString } from '@/core/security/csp/buildCsp';

// Cache per-edge-instance
declare global {
  // eslint-disable-next-line no-var
  var __CSP_CACHE__: { value: string; expiresAt: number } | undefined;
}

const CACHE_TTL_SECONDS = 60; // keep short but effective
const PUBLIC_CSP_ENDPOINT = '/api/public/csp';

export async function middleware(request: NextRequest) {
  try {
    const now = Date.now();
    if (global.__CSP_CACHE__ && global.__CSP_CACHE__.expiresAt > now) {
      const res = NextResponse.next();
      res.headers.set('Content-Security-Policy', global.__CSP_CACHE__.value);
      return res;
    }

    // Fetch config from internal public endpoint
    const origin = request.nextUrl.origin;
    const cfgRes = await fetch(origin + PUBLIC_CSP_ENDPOINT, { cache: 'no-store' });
    if (!cfgRes.ok) {
      // fallback to a conservative policy
      const fallback = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'";
      global.__CSP_CACHE__ = { value: fallback, expiresAt: now + CACHE_TTL_SECONDS * 1000 };
      const res = NextResponse.next();
      res.headers.set('Content-Security-Policy', fallback);
      return res;
    }

    const body = await cfgRes.json();
    const cfg = body?.config || {};
    const cspString = buildCspString(cfg);

    global.__CSP_CACHE__ = { value: cspString, expiresAt: now + CACHE_TTL_SECONDS * 1000 };

    const res = NextResponse.next();
    res.headers.set('Content-Security-Policy', cspString);
    return res;
  } catch (e) {
    const fallback = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'";
    const res = NextResponse.next();
    res.headers.set('Content-Security-Policy', fallback);
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.*|robots.txt).*)'],
};
