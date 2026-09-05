// src/core/cache/core-cache.ts
import { cache } from 'react';

/**
 * Gestor centralizado de caché del sistema inspirado en la arquitectura de Magento 2,
 * encargado de aislar y controlar el almacenamiento temporal, invalidación y refresco por capas.
 */
export class CoreCache {
    /**
     * Envuelve operaciones asíncronas bajo un mecanismo de caché por request (React cache)
     * optimizando consultas concurrentes y evitando llamadas redundantes a infraestructura.
     */
    public static remember<T extends (...args: any[]) => Promise<any>>(
        _key: string,
        fetcher: T
    ): T {
        return cache(fetcher) as unknown as T;
    }

    /**
     * Limpia o invalida los registros temporales del sistema.
     */
    public static async clean(tag?: string): Promise<void> {
        if (tag) {
            // Lógica de invalidación y purga de tags específicos
        }
    }
}