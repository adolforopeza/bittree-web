// src/core/security/cookie-security.ts
import { NextResponse } from 'next/server';

export function setSecureSessionCookie(response: NextResponse, name: string, token: string): void {
    response.cookies.set(name, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
    });
}