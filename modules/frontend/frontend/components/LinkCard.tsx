// modules/frontend/frontend/components/LinkCard.tsx
import React from 'react';

export interface LinkCardProps {
    href: string;
    icon: string;
    label: string;
    isPrimary?: boolean;
    target?: string;
    rel?: string;
    download?: boolean;
}

export function LinkCard({ href, icon, label, isPrimary, target = '_blank', rel = 'noopener noreferrer', download }: LinkCardProps) {

    const safeProtocol = /^(https?|mailto|tel):/i;
    const isSafe = href.startsWith('/') || safeProtocol.test(href);
    const sanitizedHref = isSafe ? href : '#';
    const variant = `mr-3 text-emerald-400 w-5 text-center flex items-center justify-center ${icon}`;

    return (
        <a
            href={sanitizedHref}
            target={target}
            rel={rel}
            download={download}
            className={`flex items-center p-4 border transition-colors ${isPrimary ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-200 hover:border-slate-700'}`}
        >
            <i className={variant} />
            <span className="font-semibold text-sm">
                {label}
            </span>
        </a>
    );
}
