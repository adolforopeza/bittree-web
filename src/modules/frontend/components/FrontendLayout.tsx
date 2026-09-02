// src/modules/frontend/components/FrontendLayout.tsx
import type { Locale } from '@/core/i18n/config';

interface FrontendLayoutProps {
    lang: Locale;
    children: React.ReactNode;
}

/**
 * Contenedor principal de la estructura visual frontend.
 */
export function FrontendLayout({ children }: FrontendLayoutProps) {
    return (
        <main className="relative flex-grow w-full max-w-md mx-auto px-6 pb-12 flex flex-col items-center">
            {children}
        </main>
    );
}