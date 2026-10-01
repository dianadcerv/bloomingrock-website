export const APP_HOST = "app.bloomingrocksolutions.com";
export const PORTAL_PREFIX = "/portal";
export const MARKETING_ORIGIN = "https://www.bloomingrocksolutions.com";

const PORTAL_PATH_PATTERN =
  /^(?:\/login|\/dashboard|\/inbox|\/jobs|\/workflows|\/documents|\/requests|\/auth)(?:\/|$)/;

const MARKETING_PATH_PATTERN =
  /^(?:\/about|\/capabilities|\/look|\/make-ai-stick)(?:\/|$)/;

export function hostnameOf(hostHeader: string) {
  return hostHeader.trim().toLowerCase().split(":")[0] ?? "";
}

export function isAppHost(hostHeader: string) {
  const hostname = hostnameOf(hostHeader);
  if (hostname === APP_HOST) return true;
  if (hostname === "app.localhost") return true;
  return hostname.startsWith("app.");
}

export function isPortalPath(pathname: string) {
  return PORTAL_PATH_PATTERN.test(pathname);
}

export function isMarketingPath(pathname: string) {
  return pathname === "/" || MARKETING_PATH_PATTERN.test(pathname);
}

export function toInternalPortalPath(pathname: string) {
  if (pathname === "/" || pathname === "") return PORTAL_PREFIX;
  if (pathname.startsWith(`${PORTAL_PREFIX}/`) || pathname === PORTAL_PREFIX) {
    return pathname;
  }
  return `${PORTAL_PREFIX}${pathname}`;
}

/** Public origin for the app host. Unset in local/preview so Login stays on this host. */
export function getAppOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "";
}

export function getPublicLoginHref() {
  const origin = getAppOrigin();
  return origin ? `${origin}/login` : "/login";
}

export function getMarketingOrigin() {
  return MARKETING_ORIGIN;
}
