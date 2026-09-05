// src/core/cache/profile-cache.ts
import { CoreCache } from '@/core/cache/core-cache';
import { ProfileRepository } from '@/core/database/profiles/repository';
import type { Profile } from '@/core/database/profiles/types';

/**
 * Módulo especializado de caché para la entidad Profile,
 * desacoplando la lógica de negocio y unificando el ciclo de vida de los datos del perfil.
 */
export class ProfileCache {
    private static readonly CACHE_KEY = 'profile-active-entity';

    /**
     * Obtiene el perfil activo de forma centralizada y cacheada para ser reutilizado
     * tanto en la generación dinámica de metadatos (SEO) como en la renderización de la página (SSR).
     */
    public static getActiveProfile = CoreCache.remember(
        this.CACHE_KEY,
        async (): Promise<Profile | null> => {
            const targetUsername = process.env.USER_NAME || '';

            if (targetUsername) {
                const response = await ProfileRepository.getProfiles(targetUsername);
                if (response.success && response.data && response.data.length > 0) {
                    return response.data[0];
                }
            }

            const fallbackResponse = await ProfileRepository.getProfiles();
            if (fallbackResponse.success && fallbackResponse.data && fallbackResponse.data.length > 0) {
                return fallbackResponse.data.find((p) => p.is_active) || fallbackResponse.data[0];
            }

            return null;
        }
    );

    /**
     * Invalida, limpia y refresca el caché del perfil tras actualizaciones o mutaciones críticas.
     */
    public static async purge(): Promise<void> {
        await CoreCache.clean(this.CACHE_KEY);
    }
}