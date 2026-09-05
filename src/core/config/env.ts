// src/core/config/env.ts

// Do NOT import this file. Import env.client.ts for browser-safe values, or env.server.ts for server-only values.
// This file intentionally throws to prevent accidental usage of a single env barrel that could leak secrets to the client.
throw new Error('Import env.client.ts or env.server.ts directly — do not import src/core/config/env.ts');
