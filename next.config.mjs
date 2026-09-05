/**
 * Configuración global de Next.js para el enrutamiento y ofuscación de seguridad.
 * Utiliza rewrites asíncronos para interceptar la URL pública personalizada definida en la
 * variable de entorno ADMIN_SLUG y redirigirla de forma transparente hacia la carpeta física
 * real (/backend), ocultando la estructura del panel administrativo frente a bots de indexación
 * y escaneos automatizados.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [{
            source: '/(.*)',
            headers: [
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
            ],
        }];
    },
    async rewrites() {
        return [
            {
                source: `/${process.env.ADMIN_SLUG || 'admin'}`,
                destination: '/backend',
            },
            {
                source: `/${process.env.ADMIN_SLUG || 'admin'}/:path*`,
                destination: '/backend/:path*',
            },
        ];
    },
};

export default nextConfig;