import { NextRequest, NextResponse } from "next/server";
import {
  consumeMagicToken,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/portal/session";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const user = consumeMagicToken(token);
  const login = new URL("/login", request.url);

  if (!user) {
    login.searchParams.set("error", "expired");
    return NextResponse.redirect(login);
  }

  const dashboard = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(dashboard);
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(user),
    sessionCookieOptions(),
  );
  return response;
}
