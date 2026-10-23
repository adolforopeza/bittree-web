// next.config.mjs
/** @type {import('next').NextConfig} */
import { generateCspHeader, getSecurityHeaders } from './src/core/security-policy.mjs';
import { env } from './src/core/env.ts';
import { defaultLocale } from './src/core/i18n.ts';

const isDevelopment = env.nodeEnv !== 'production';
const securityHeaders = getSecurityHeaders();

const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: `/${defaultLocale}`,
                permanent: false,
            },
        ];
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: [
                {
                    key: 'Content-Security-Policy',
                    value: generateCspHeader(isDevelopment),
                },
                ...Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
            ],
        }];
    },
};

export default nextConfig;