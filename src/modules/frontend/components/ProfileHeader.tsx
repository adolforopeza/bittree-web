// src/modules/frontend/components/ProfileHeader.tsx
import type { ResolvedProfile } from '@/core/database/profiles/types';

interface ProfileHeaderProps {
    profile: ResolvedProfile;
    availableTooltip: string;
}

/**
 * Componente de cabecera que muestra la identidad visual y datos del perfil activo utilizando datos preprocesados.
 */
export function ProfileHeader({ profile, availableTooltip }: ProfileHeaderProps) {
    const keywords = profile.resolved_keywords.length > 0
        ? profile.resolved_keywords
        : [];

    return (
        <header className="text-center mb-10 w-full mt-8">
            <div className="relative inline-block mb-6">
                <img
                    src={profile.avatar_url || '/og-default.png'}
                    alt={`Fotografía de perfil de ${profile.full_name}`}
                    className="profile-avatar w-32 h-32 object-cover border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-full"
                    width="128"
                    height="128"
                />
                <span
                    className="user-status absolute bottom-2 right-2 block w-5 h-5 bg-emerald-500 border-2 border-black rounded-full"
                    title={availableTooltip}
                />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{profile.full_name}</h1>
            <h2 className="text-emerald-400 text-lg font-medium tracking-wide uppercase mb-3">{profile.headline || profile.resolved_title}</h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">{profile.bio || profile.resolved_description}</p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {keywords.map((kw, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-900 border border-emerald-600 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                        {kw}
                    </span>
                ))}
            </div>
        </header>
    );
}