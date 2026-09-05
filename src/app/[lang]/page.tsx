// src/app/[lang]/page.tsx
import { ProfileCache } from '@/core/cache/profile-cache';
import { ProfileRepository } from '@/core/database/profiles/repository';
import type { ProfileLink } from '@/core/database/profiles/types';
import type { Locale } from '@/core/i18n/config';
import { getDictionary } from '@/core/i18n/dictionaries';
import { FrontendLayout } from '@/modules/frontend/components/FrontendLayout';
import { ProfileHeader } from '@/modules/frontend/components/ProfileHeader';
import { LinkCard } from '@/modules/frontend/components/LinkCard';

interface HomePageProps {
    params: Promise<{
        lang: Locale;
    }>;
}

/**
 * Página principal localizada que consume directamente el ProfileCache centralizado,
 * evitando llamadas duplicadas y unificando el ciclo de vida de la petición.
 */
export default async function LocalizedHomePage({ params }: HomePageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const cachedProfile = await ProfileCache.getActiveProfile();

    if (!cachedProfile) {
        return (
            <FrontendLayout lang={lang}>
                <div className="text-center py-20 font-mono text-xs">
                    <h1 className="text-emerald-400 font-bold text-sm mb-2">{dict.system.offline}</h1>
                    <p className="text-slate-400">{dict.system.no_profiles}</p>
                </div>
            </FrontendLayout>
        );
    }

    const profile = ProfileRepository.resolveProfileLocale(cachedProfile, lang);

    const links: ProfileLink[] = (profile.links || [])
        .sort((a, b) => a.position - b.position);

    return (
        <FrontendLayout lang={lang}>
            <ProfileHeader
                profile={profile}
                availableTooltip={dict.system.available_tooltip}
            />

            <nav className="w-full space-y-4" aria-label={`Enlaces principales de ${profile.full_name}`}>
                {links.map((link: ProfileLink) => {
                    const langKey = lang as string;
                    const linkLangMap = link.link_json.lang as unknown as Record<string, {
                        title: string;
                        subtitle?: string;
                        badge?: string
                    }>;
                    const localizedLang = linkLangMap?.[langKey] || linkLangMap?.['es'] || (linkLangMap ? Object.values(linkLangMap)[0] : undefined);
                    const url = typeof link.link_json.url === 'string' ? link.link_json.url : '#';
                    const title = localizedLang?.title || 'Enlace';
                    const variants = link.link_json.variants as any;

                    return (
                        <LinkCard
                            key={link.entity_id}
                            href={url}
                            icon={link.icon}
                            label={title}
                            isPrimary={variants?.isPrimary}
                            target={variants?.openInNewWindow ? variants?.seoTarget || '_blank' : '_self'}
                            rel={variants?.seoRel}
                            download={variants?.downloadDirect}
                        />
                    );
                })}
            </nav>
        </FrontendLayout>
    );
}