import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/portal/session";

export async function GET(request: NextRequest) {
  const login = new URL("/login", request.url);
  const response = NextResponse.redirect(login);
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
