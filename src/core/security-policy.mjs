const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

const cspDirectives = (isDevelopment = false) => ({
    'default-src': ["'self'"],
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        ...(isDevelopment ? ["'unsafe-eval'"] : []),
        'https://*.supabase.co',
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
    'img-src': [
        "'self'",
        'data:',
        'https://*.supabase.co',
        'https://*.googleusercontent.com',
        'https://avatars.githubusercontent.com',
        'https://*.githubusercontent.com',
    ],
    'connect-src': ["'self'", 'https://*.supabase.co'],
    'font-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com'],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true,
});

const serializeCsp = (directives) => Object.entries(directives)
    .map(([name, value]) => value === true ? name : `${name} ${value.join(' ')}`)
    .join('; ');

export function generateCspHeader(isDevelopment = false) {
    return serializeCsp(cspDirectives(isDevelopment));
}

export function getSecurityHeaders() {
    return securityHeaders;
}