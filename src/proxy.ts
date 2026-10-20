import { NextResponse, type NextRequest } from "next/server";
import {
  getAppOrigin,
  getMarketingOrigin,
  isAppHost,
  isMarketingPath,
  isPortalPath,
  toInternalPortalPath,
} from "@/lib/portal/hosts";

export function proxy(request: NextRequest) {
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
    const response = NextResponse.rewrite(url);
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
