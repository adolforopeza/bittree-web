# Bettree

Bettree es una alternativa minimalista y ligera inspirada en Linktree, diseñada para mostrar enlaces profesionales y personales de forma directa, eficiente y optimizada.

## Stack Tecnológico

* **Framework**: Next.js 16.3.3 (App Router con Server Components y Server Actions)
* **Librería UI**: React 19.2.8
* **Estilizado**: Tailwind CSS 4.3.3 con PostCSS
* **Capa de Datos y Auth**: Supabase (`@supabase/supabase-js` v2.112.4 y `@supabase/ssr` v0.12.5) con Procedimientos Almacenados (RPC)
* **Gestor de Paquetes**: pnpm 10.33.0
* **Internacionalización (i18n)**: Soporte nativo multilingüe (Español / Inglés)

---

## Arquitectura de Seguridad

La aplicación usa Server Components para consultar el perfil directamente mediante
el RPC `get_profile` de Supabase. Las variables de entorno se validan en
`src/core/env.ts`, los enlaces se sanitizan en `LinkCard` y las cabeceras CSP y
de seguridad se aplican desde `next.config.mjs`.

---

## Estructura del Proyecto

```text
src/
├── core/
│   ├── cache.ts         # Caché por petición con React cache
│   ├── database.ts      # Cliente Supabase y RPC get_profile
│   ├── env.ts           # Validación estricta de entorno
│   ├── i18n.ts          # Diccionarios ES/EN
│   ├── security.ts      # CSP y sanitización de URLs
│   └── seo.ts           # Metadatos localizados
├── components/ui/       # Componentes visuales puros
└── app/[lang]/          # Server Components localizados
```

## QA local

```bash
pnpm install
pnpm run build
pnpm run dev
```

La página pública está disponible en `/es` y `/en`; la raíz redirige al idioma
predeterminado. La clave `SUPABASE_SERVICE_ROLE_KEY` sólo se usa en el servidor.