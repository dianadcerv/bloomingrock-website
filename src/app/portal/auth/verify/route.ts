import { NextRequest, NextResponse } from "next/server";
import { safePortalNextPath } from "@/lib/portal/login-redirect";
import {
  consumeMagicToken,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/portal/session";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const next = safePortalNextPath(request.nextUrl.searchParams.get("next"));
  const user = consumeMagicToken(token);
  const login = new URL("/login", request.url);

  if (!user) {
    login.searchParams.set("error", "expired");
    if (next) login.searchParams.set("next", next);
    return NextResponse.redirect(login);
  }

  const defaultPath = user.role === "superadmin" ? "/admin/shops" : "/dashboard";
  const destination = new URL(next ?? defaultPath, request.url);
  const response = NextResponse.redirect(destination);
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(user),
    sessionCookieOptions(),
  );
  return response;
}
