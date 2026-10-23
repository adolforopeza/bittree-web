import type { MetadataRoute } from 'next';
import { getProfileUsernames } from '@/core/database';
import { defaultLocale, locales } from '@/core/i18n';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const dynamic = 'force-dynamic';

function localizedUrl(lang: string, username?: string): string {
    return new URL(`/${lang}${username ? `/${encodeURIComponent(username)}` : ''}`, siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const profileUsernames = await getProfileUsernames();
    const entries: MetadataRoute.Sitemap = [];

    for (const lang of locales) {
        const url = localizedUrl(lang);
        entries.push({
            url,
            changeFrequency: 'daily',
            priority: 1,
            alternates: {
                languages: {
                    es: localizedUrl('es'),
                    en: localizedUrl('en'),
                    'x-default': localizedUrl(defaultLocale),
                },
            },
        });
    }

    for (const username of profileUsernames) {
        for (const lang of locales) {
            entries.push({
                url: localizedUrl(lang, username),
                changeFrequency: 'weekly',
                priority: 0.8,
                alternates: {
                    languages: {
                        es: localizedUrl('es', username),
                        en: localizedUrl('en', username),
                        'x-default': localizedUrl(defaultLocale, username),
                    },
                },
            });
        }
    }

    return entries;
}
