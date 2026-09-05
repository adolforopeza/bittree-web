// src/core/security/url-sanitizer.ts
export function isSafeUrl(value: unknown, allowedHosts?: string[]): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();

  // Reject protocol-relative URLs which can be resolved differently depending on context
  if (trimmed.startsWith('//')) return false;

  try {
    const parsedUrl = new URL(trimmed, 'https://localhost');
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return false;

    if (allowedHosts && allowedHosts.length > 0) {
      return allowedHosts.map(h => h.toLowerCase()).includes(parsedUrl.hostname.toLowerCase());
    }

    // basic check done — caller may enforce same-origin or whitelist if needed
    return true;
  } catch {
    return false;
  }
}
