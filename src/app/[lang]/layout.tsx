// src/app/[lang]/layout.tsx
import generateLocalizedMetadata from '@/core/seo';
import { generateLocalizedSchema } from '@/core/schema';
import { defaultLocale, isLocale, locales, type Locale } from '@/core/i18n';
import { getDictionary } from '@/core/i18n';
import FrontendLayout from '@/components/ui/FrontendLayout';
import LanguageSelector from '@/components/ui/LanguageSelector';
import Footer from '@/components/ui/Footer';
import type { Viewport } from 'next';
import './globals.css';

export const generateMetadata = generateLocalizedMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await props.params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);

  const jsonLdString = await generateLocalizedSchema(props);

  return (
    <html lang={lang}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </head>
      <body suppressHydrationWarning className="bg-black text-neutral-200 min-h-screen flex flex-col font-sans antialiased">
        <FrontendLayout lang={lang}>
          <LanguageSelector currentLang={lang} />
          {props.children}
          <Footer
            availabilityNote={dict.system.availability_note}
            rightsText={dict.system.footer_rights}
          />
        </FrontendLayout>
      </body>
    </html>
  );
}
