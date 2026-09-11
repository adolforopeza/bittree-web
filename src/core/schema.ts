// src/core/schema.ts
import {getProfile, resolveProfileLocale} from './database';
import {defaultLocale, getDictionary, isLocale, type Locale} from './i18n';


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bittree-web.vercel.app';

interface GenerateLocalizedSchemaProps {
    params: Promise<{
        lang: string;
    }>;
}

export async function generateLocalizedSchema(props?: GenerateLocalizedSchemaProps) {
    const resolvedParams = props ? await props.params : undefined;
    const requestedLang = resolvedParams?.lang || defaultLocale;
    const lang: Locale = isLocale(requestedLang) ? requestedLang : defaultLocale;
    const rawProfile = await getProfile();

    if (!rawProfile) {
        return {};
    }

    const profile = resolveProfileLocale(rawProfile, lang);

    const dict = await getDictionary(lang);

    const username = profile?.username || 'adolforopeza';
    const fullName = profile?.full_name || 'Adolfo Oropeza';
    const avatarUrl = profile?.avatar_url || 'https://avatars.githubusercontent.com/u/3385221';
    const canonicalUrl = `${siteUrl}/${lang}`;

    const schemaData = {
        '@context': 'https://schema.org',
        "@graph": [{
            "@type": 'Person',
            "@id": canonicalUrl,
            "name": fullName,
            "alternateName": username,
            "image": avatarUrl,
            "url": canonicalUrl,
            "email": 'adolforopeza01@gmail.com',
            "description": profile?.resolved_description,
            "jobTitle": profile?.resolved_title,
            "gender": dict.system.gender,
            "sameAs": [
                'https://github.com/adolforopeza',
                'https://linkedin.com/in/adolforopeza',
                'https://youtube.com/@adolforopeza',
                'https://instagram.com/adolforopeza'
            ],
        }]
    };

    return JSON.stringify(schemaData);
}