// src/core/i18n/dictionaries.ts
import 'server-only';
import type { Locale } from '@/core/i18n/config';

const dictionaries = {
    es: () => import('@/core/i18n/locales/es.json').then((module) => module.default),
    en: () => import('@/core/i18n/locales/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
    return dictionaries[locale]?.() ?? dictionaries.es();
};