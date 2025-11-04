const DEFAULT_BASE_URL = "https://mondkalender.app";

/**
 * Resolve the public base URL for metadata generation and canonical links.
 * Falls back to the default domain and trims trailing slashes.
 */
export function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_WEB_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    DEFAULT_BASE_URL;

  return raw.replace(/\/+$/, "");
}

export { DEFAULT_BASE_URL };
