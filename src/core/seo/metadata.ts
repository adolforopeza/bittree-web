// src/core/seo/metadata.ts
import type { Metadata } from 'next';
import { ProfileCache } from '@/core/cache/profile-cache';
import type { Locale } from '@/core/i18n/config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface GenerateLocalizedMetadataProps {
    params: Promise<{
        lang: Locale;
    }>;
}

/**
 * Genera metadatos avanzados para SEO reutilizando el ProfileCache centralizado.
 */
export async function generateLocalizedMetadata(props?: GenerateLocalizedMetadataProps): Promise<Metadata> {
    const resolvedParams = props ? await props.params : undefined;
    const lang = resolvedParams?.lang || 'es';
    const profile = await ProfileCache.getActiveProfile();

    const title = profile ? `${profile.full_name} (@${profile.username}) | Bittree` : 'Bittree';
    const description = profile?.headline || profile?.bio || 'Plataforma descentralizada de gestión de perfiles, enlaces e identidades digitales con alto rendimiento.';
    const imageUrl = profile?.avatar_url || '/og-default.png';
    const canonicalUrl = `${siteUrl}/${lang}${profile ? `/${profile.username}` : ''}`;

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: title,
            template: `%s | ${profile?.full_name || 'Bittree'}`,
        },
        description,
        applicationName: 'Bittree',
        authors: [{ name: profile?.full_name || 'Bittree Admin' }],
        generator: 'Next.js',
        keywords: ['portfolio', 'digital identity', 'developer', 'links', 'bittree', profile?.username || 'user'].filter(Boolean),
        referrer: 'origin-when-cross-origin',
        creator: profile?.full_name || 'Bittree',
        publisher: 'Bittree Security Enclave',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'es': `${siteUrl}/es${profile ? `/${profile.username}` : ''}`,
                'en': `${siteUrl}/en${profile ? `/${profile.username}` : ''}`,
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