// src/core/seo.ts
/**
 * Generación de metadatos SEO dinámicos y localizados.
 */
import type { Metadata } from 'next';
import {getProfile, getProfileSummary, resolveProfileLocale} from './database';
import { defaultLocale, isLocale, type Locale } from './i18n';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface GenerateLocalizedMetadataProps {
    params: Promise<{
        lang: Locale;
    }>;
}

async function generateLocalizedMetadata(props?: GenerateLocalizedMetadataProps): Promise<Metadata> {
    const resolvedParams = props ? await props.params : undefined;
    const requestedLang = resolvedParams?.lang || defaultLocale;
    const lang: Locale = isLocale(requestedLang) ? requestedLang : defaultLocale;
    const rawProfile = await getProfile();

    if (!rawProfile) {
        return {};
    }

    const profile = resolveProfileLocale(rawProfile, lang);

    const title = profile ? `${profile.full_name} (@${profile.username}) | Full Stack Senior` : 'Bittree';
    const description = profile?.headline || profile?.bio || '';
    const imageUrl = profile?.avatar_url || '/og-default.png';
    const canonicalUrl = `${siteUrl}/${lang}${profile ? `/${profile.username}` : ''}`;
    // @ts-ignore
    const keywords = profile?.settings?.seo?.keywords || {};

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: title,
            template: `%s | ${profile?.full_name || 'Bittree'}`,
        },
        description,
        applicationName: 'Bittree',
        authors: [{ name: profile?.full_name || 'Bittree' }],
        generator: 'Next.js',
        keywords: [keywords].filter(Boolean),
        referrer: 'origin-when-cross-origin',
        creator: profile?.full_name || 'Bittree',
        publisher: profile?.full_name || 'Bittree',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'es': `${siteUrl}/es`,
                'en': `${siteUrl}/en`,
            },
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: 'website',
            url: canonicalUrl,
            title,
            description,
            siteName: 'Bittree Ecosystem',
            locale: lang === 'es' ? 'es_ES' : 'en_US',
            alternateLocale: lang === 'es' ? 'en_US' : 'es_ES',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                    type: 'image/jpeg',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: `@${profile?.username || 'bittree'}`,
            images: [imageUrl],
        },
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
            yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
            other: {
                'whatsapp-identity': [profile?.username || 'bittree'],
            },
        },
        category: 'technology',
    };
}

export default generateLocalizedMetadata
