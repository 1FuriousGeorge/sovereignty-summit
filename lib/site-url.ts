/**
 * Canonical origin for metadata (Open Graph, Twitter/X, canonical URLs).
 * Set NEXT_PUBLIC_SITE_URL in Vercel to the public domain so previews never
 * resolve against *.vercel.app or localhost.
 */
const PRODUCTION_SITE_URL = "https://summit.murphslifefoundation.com";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return "http://localhost:3000";
}
