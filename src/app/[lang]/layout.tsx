// src/app/[lang]/layout.tsx
import { FrontendLayout } from '@/modules/frontend/components/FrontendLayout';
import { LanguageSelector } from '@/modules/frontend/components/LanguageSelector';
import { Footer } from '@/modules/frontend/components/Footer';
import { generateLocalizedMetadata } from '@/core/seo/metadata';
import { i18n, type Locale } from '@/core/i18n/config';
import { getDictionary } from '@/core/i18n/dictionaries';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata = generateLocalizedMetadata();

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#020617',
};

export function generateStaticParams() {
    return i18n.locales.map((lang) => ({ lang }));
}

export default async function RootLayout(props: any) {
    const resolvedParams = await props.params;
    const lang = (resolvedParams?.lang || i18n.defaultLocale) as Locale;
    const { children } = props;

    const dict = await getDictionary(lang);
    const d = dict || { system: {} };

    return (
        <html lang={lang}>
        <head>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />
        </head>
        <body className="bg-black text-neutral-200 min-h-screen flex flex-col font-sans antialiased">
        <FrontendLayout lang={lang}>
            <LanguageSelector currentLang={lang} />
            {children}
            <Footer
                availabilityNote={d.system.availability_note || "Disponible para proyectos y contratación"}
                rightsText={d.system.footer_rights || "Todos los derechos reservados."}
            />
        </FrontendLayout>
        </body>
        </html>
    );
}