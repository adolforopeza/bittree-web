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

## Arquitectura de Seguridad y Endurecimiento

El sistema implementa estrictas políticas de control de acceso y aislamiento perimetral:

1. **Control de Tráfico Edge (`proxy.ts`)**: Intercepta y valida rutas administrativas basándose en slugs dinámicos (`ADMIN_SLUG`), restringiendo el acceso exclusivamente a correos electrónicos autorizados (`ADMIN_ALLOWED_EMAIL`).
2. **Validación de Identidad en Server Actions**: Las mutaciones de datos críticos (creación, actualización y eliminación de perfiles y enlaces) verifican criptográficamente la sesión activa antes de procesar cualquier transacción en base de datos.
3. **Mitigación de XSS**: Sanitización estricta de esquemas URL en componentes de renderizado de hipervínculos (`LinkCard`), bloqueando protocolos maliciosos como `javascript:`.
4. **Validación Perimetral de Entorno (`env.ts`)**: Verificación estricta de variables críticas al arrancar la aplicación para evitar fallos silenciosos y configuraciones inseguras.

---

## Estructura del Proyecto

```text
src/
├── core/
│   ├── config/          # Validación estricta de variables de entorno
│   ├── database/        # Clientes Supabase (Browser, SSR, Admin) y Repositorios RPC
│   ├── i18n/            # Configuración de localización, diccionarios y rutas
│   └── seo/             # Generación dinámica de metadatos optimizados
└── modules/
    ├── admin/           # Paneles administrativos, Server Actions y gestión segura
    └── frontend/        # Componentes de interfaz pública (Perfiles, Enlaces, Header/Footer)