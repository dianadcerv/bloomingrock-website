import { isPortalPath } from "@/lib/portal/hosts";

/** Accept only same-origin portal paths for post-login redirect (no open redirects). */
export function safePortalNextPath(next: string | null | undefined): string | null {
  if (!next) return null;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  const pathname = trimmed.split("?")[0]?.split("#")[0] ?? "";
  if (!pathname || !isPortalPath(pathname)) return null;
  if (pathname === "/login" || pathname.startsWith("/auth")) return null;
  return trimmed;
}

export function loginHrefWithNext(next: string | null | undefined): string {
  const safe = safePortalNextPath(next);
  if (!safe) return "/login";
  return `/login?next=${encodeURIComponent(safe)}`;
}
