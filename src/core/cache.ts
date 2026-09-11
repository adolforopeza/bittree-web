// src/core/cache.ts
/**
 * Wrappers de caché utilizando la función nativa de React.
 */
import { cache } from 'react';

/**
 * Memoriza funciones asíncronas durante el ciclo de vida de una petición.
 */
export const remember = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
    return cache(fn) as unknown as T;
};
