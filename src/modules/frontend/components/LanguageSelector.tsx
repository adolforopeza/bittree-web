// src/modules/frontend/components/LanguageSelector.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/core/i18n/config';

interface LanguageSelectorProps {
    currentLang: Locale;
}

export function LanguageSelector({ currentLang }: LanguageSelectorProps) {
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
                <button
                    onClick={() => switchLanguage('es')}
                    className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors ${
                        currentLang === 'es'
                            ? 'bg-emerald-600 text-black hover:bg-emerald-500'
                            : 'bg-neutral-900 text-emerald-500 hover:bg-neutral-800 border-l border-emerald-600'
                    }`}
                >
                    ES
                </button>
                <button
                    onClick={() => switchLanguage('en')}
                    className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors ${
                        currentLang === 'en'
                            ? 'bg-emerald-600 text-black hover:bg-emerald-500'
                            : 'bg-neutral-900 text-emerald-500 hover:bg-neutral-800 border-l border-emerald-600'
                    }`}
                >
                    EN
                </button>
            </div>
        </div>
    );
}