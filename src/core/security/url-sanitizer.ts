// src/core/security/url-sanitizer.ts
export function isSafeUrl(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    try {
        const parsedUrl = new URL(value, 'https://localhost');
        return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
}