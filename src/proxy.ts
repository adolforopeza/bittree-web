// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
// @ts-ignore
import { env } from '@/core/config/env';
import { i18n } from '@/core/i18n/config';

/**
 * Intercepts network traffic at the edge, enforcing language prefix validation, redirection, and absolute administrative security controls.
 */
export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const currentPath = request.nextUrl.pathname;

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !currentPath.startsWith(`/${locale}/`) && currentPath !== `/${locale}`
    );

    const adminSlug = env.adminSlug;
    const isAdminRoute = currentPath.startsWith('/backend') || currentPath.startsWith(`/${adminSlug}`);

    if (pathnameIsMissingLocale && !isAdminRoute && !currentPath.startsWith('/api')) {
        const locale = i18n.defaultLocale;
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = `/${locale}${currentPath === '/' ? '' : currentPath}`;
        return NextResponse.redirect(redirectUrl);
    }

    const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
        db: {
            schema: env.supabaseSchema,
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
        const allowedAdminEmail = env.adminAllowedEmail;
        if (user.email !== allowedAdminEmail) {
            await supabase.auth.signOut();
            const unauthorizedUrl = request.nextUrl.clone();
            unauthorizedUrl.pathname = `/${i18n.defaultLocale}`;
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.*|robots.txt).*)',
    ],
};