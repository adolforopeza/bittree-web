# MODULES README

This folder contains a lightweight modular kernel inspired by Magento 2, implemented for a Next.js app router project.

Structure:
- modules/: directory where each module lives (manifest.json + frontend/server folders)
- src/core/loader/ModuleLoader.ts: reads manifests and tracks enabled modules
- src/core/module-manager: runtime manager with ephemeral persistence to /tmp/modules-state.json
- src/core/logger: basic logger with file sink (/tmp/app.log) and console sink
- Admin API: GET/POST /api/admin/modules (protected by ADMIN_API_KEY) to list and toggle modules
- Public API: GET /api/public/modules to read available modules

Notes:
- Persistence is ephemeral (no DB). For global persistence across instances use Supabase table (optional).
- Module frontend/server loading via dynamic import/require is best-effort; due to Next.js bundling dynamic imports may require module entrypoints to be statically analyzable.
