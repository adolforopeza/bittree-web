// src/core/i18n/config.ts
export const i18n = {
    defaultLocale: 'es',
    locales: ['es', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];