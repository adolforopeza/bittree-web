// src/core/i18n.ts
/**
 * Gestión simplificada de internacionalización.
 */
export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}

const dictionaries = {
    es: () => import('./locales/es.json').then((module) => module.default),
    en: () => import('./locales/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
    return dictionaries[locale]?.() ?? dictionaries.es();
};
