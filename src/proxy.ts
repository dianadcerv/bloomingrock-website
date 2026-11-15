import { NextResponse, type NextRequest } from "next/server";
import { consumeEdgeFormPost, middlewareClientIp } from "@/lib/form-rate-limit";
import {
  getAppOrigin,
  getMarketingOrigin,
  isAppHost,
  isMarketingPath,
  isPortalPath,
  toInternalPortalPath,
} from "@/lib/portal/hosts";

const FORM_RATE_LIMIT_PATHS = ["/look", "/pre-quote-checklist", "/paid-look-intake"] as const;

function isFormRateLimitPath(pathname: string) {
  return FORM_RATE_LIMIT_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  if (
    request.method === "POST" &&
    request.headers.get("next-action") &&
    isFormRateLimitPath(request.nextUrl.pathname)
  ) {
    const ip = middlewareClientIp(request.headers);
    if (!consumeEdgeFormPost(ip)) {
      return new NextResponse(null, {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }
  }

  const host = request.headers.get("host") ?? "";
  const appHost = isAppHost(host);
  const { pathname, search } = request.nextUrl;
  const appOrigin = getAppOrigin();

  if (appHost && pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  if (appHost && pathname === "/sitemap.xml") {
    return new NextResponse(null, { status: 404 });
  }

  if (appHost && isMarketingPath(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL(pathname + search, getMarketingOrigin()));
  }

  if (!appHost && isPortalPath(pathname) && appOrigin) {
    return NextResponse.redirect(new URL(pathname + search, appOrigin));
  }

  if (appHost || isPortalPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = toInternalPortalPath(pathname);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname + search);
    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};