import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/portal/session";

function clearSessionResponse(request: NextRequest) {
  const login = new URL("/login", request.url);
  const response = NextResponse.redirect(login);
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

/** Prefetch-safe: never clear the session on GET. */
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  return clearSessionResponse(request);
}
