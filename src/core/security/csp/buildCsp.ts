// src/core/security/csp/buildCsp.ts

export type CspConfig = Record<string, string[] | boolean>;

function serializeDirective(name: string, value: string[] | boolean): string | null {
  if (value === false) return null;
  if (value === true) return name; // directives like upgrade-insecure-requests
  if (Array.isArray(value) && value.length > 0) {
    return `${name} ${value.join(' ')}`;
  }
  return null;
}

export function buildCspString(cfg: CspConfig): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(cfg)) {
    const d = serializeDirective(k, v);
    if (d) parts.push(d);
  }
  return parts.join('; ');
}
