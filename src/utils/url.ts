import { headers } from "next/headers";

/**
 * Returns the exact absolute site URL for the current environment.
 * Evaluates in order:
 * 1. Request headers (`x-forwarded-host` or `host`)
 * 2. `NEXT_PUBLIC_SITE_URL` env variable
 * 3. `NEXT_PUBLIC_VERCEL_URL` env variable
 * 4. Fallback to `http://localhost:3000`
 */
export async function getSiteUrl(): Promise<string> {
  try {
    const headerList = await headers();
    const host = headerList.get("x-forwarded-host") || headerList.get("host");
    const proto = headerList.get("x-forwarded-proto") || "https";

    if (host) {
      // Ensure localhost uses http if not specified
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : proto;
      return `${protocol}://${host}`;
    }
  } catch {
    // Fallback if called outside request scope
  }

  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, "");
}
