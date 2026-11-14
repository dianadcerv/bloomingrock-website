import { NextResponse, type NextRequest } from "next/server";
import { consumeEdgeFormPost, middlewareClientIp } from "@/lib/form-rate-limit";

export function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next();
  }
  if (!request.headers.get("next-action")) {
    return NextResponse.next();
  }

  const ip = middlewareClientIp(request.headers);
  if (!consumeEdgeFormPost(ip)) {
    return new NextResponse(null, {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/look", "/pre-quote-checklist", "/paid-look-intake"],
};