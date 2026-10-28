/**
 * Validates that a URL uses a safe protocol (http or https).
 * Prevents javascript: and other dangerous URI schemes.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL string: returns the URL if safe, otherwise null.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  return isSafeUrl(url) ? url! : null;
}
