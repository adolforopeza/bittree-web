/**
 * Configuración global de Next.js para el enrutamiento y ofuscación de seguridad.
 * Utiliza rewrites asíncronos para interceptar la URL pública personalizada definida en la
 * variable de entorno ADMIN_SLUG y redirigirla de forma transparente hacia la carpeta física
 * real (/backend), ocultando la estructura del panel administrativo frente a bots de indexación
 * y escaneos automatizados.
 */
const nextConfig = {
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