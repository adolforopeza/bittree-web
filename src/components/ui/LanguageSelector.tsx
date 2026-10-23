// src/components/ui/LanguageSelector.tsx
"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/core/i18n';

interface LanguageSelectorProps {
    currentLang?: string;
}

export default function LanguageSelector({ currentLang }: LanguageSelectorProps) {
    const pathname = usePathname();
    const router = useRouter();

    const switchLanguage = (newLang: Locale) => {
        const segments = pathname.split('/');
        segments[1] = newLang;
        router.push(segments.join('/'));
    };

    return (
        <div className="w-full max-w-2xl mt-[10px] flex justify-end">
            <div className="top-0 right-0 flex border border-emerald-600">
                {locales.map((locale) => (
                    <button
                        key={locale}
                        onClick={() => switchLanguage(locale)}
                        className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors ${
                            currentLang === locale
                                ? 'bg-emerald-600 text-black hover:bg-emerald-500'
                                : 'bg-neutral-900 text-emerald-500 hover:bg-neutral-800 border-l border-emerald-600'
                        }`}
                    >{locale.toUpperCase()}</button>
                ))}
            </div>
        </div>
    );
}
