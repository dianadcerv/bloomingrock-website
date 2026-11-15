/** Best-effort client IP from reverse-proxy headers (Vercel / Cloudflare). */
export function clientIpFromHeaders(headerList: Headers): string {
  const real = headerList.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}