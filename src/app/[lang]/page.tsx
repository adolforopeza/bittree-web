// src/app/[lang]/page.tsx
import { getProfile, resolveProfileLocale, type ProfileLink } from '@/core/database';
import { defaultLocale, isLocale, type Locale, getDictionary } from '@/core/i18n';
import FrontendLayout from '@/components/ui/FrontendLayout';
import ProfileHeader from '@/components/ui/ProfileHeader';
import { LinkCard } from '@/components/ui/LinkCard';

interface HomePageProps {
    params: Promise<{
        lang: string;
    }>;
}

export const dynamic = 'force-dynamic';

/**
 * Página principal localizada que consume directamente el RPC de Supabase.
 */
export default async function LocalizedHomePage({ params }: HomePageProps) {
    const { lang: rawLang } = await params;
    const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
    const dict = await getDictionary(lang);

    const rawProfile = await getProfile();

    if (!rawProfile) {
        return (
            <FrontendLayout lang={lang}>
                <div className="text-center py-20 font-mono text-xs">
                    <h1 className="text-emerald-400 font-bold text-sm mb-2">{dict.system.offline}</h1>
                    <p className="text-slate-400">{dict.system.no_profiles}</p>
                </div>
            </FrontendLayout>
        );
    }

    const profile = resolveProfileLocale(rawProfile, lang);
    const username = profile.username;

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
                            username = {username}
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
