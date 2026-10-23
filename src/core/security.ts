// src/core/security.ts
/**
 * Gestión de CSP y cabeceras de seguridad.
 */
import { generateCspHeader as generatePolicyCspHeader, getSecurityHeaders } from './security-policy.mjs';

export function generateCspHeader(isDevelopment = process.env.NODE_ENV !== 'production'): string {
    return generatePolicyCspHeader(isDevelopment);
}

export const securityHeaders = getSecurityHeaders();

/**
 * Valida si una URL es segura para ser renderizada o utilizada.
 * Rechaza protocolos no seguros para mitigar riesgos de XSS.
 */
export function isSafeUrl(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    if (value.startsWith('/')) return true;

    try {
        const url = new URL(value);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
    } catch {
        return false;
    }
}
