import { SlidingWindowLimiter } from "@/lib/sliding-window-limiter";

export const LOOK_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const LOOK_RATE_LIMIT_MAX_PER_IP = 5;
export const LOOK_EMAIL_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const LOOK_EMAIL_LIMIT_MAX = 3;

export const lookIpLimiter = new SlidingWindowLimiter(
  LOOK_RATE_LIMIT_WINDOW_MS,
  LOOK_RATE_LIMIT_MAX_PER_IP,
);
export const lookEmailLimiter = new SlidingWindowLimiter(
  LOOK_EMAIL_LIMIT_WINDOW_MS,
  LOOK_EMAIL_LIMIT_MAX,
);

export const FORM_SUBMIT_RATE_LIMIT_ERROR =
  "Please wait a few minutes before sending another request.";

export const UPLOAD_RATE_LIMIT_ERROR =
  "Please wait before sending another upload. Try again shortly, or email me directly.";

/** Coarse edge gate for Server Action POST floods (per edge worker). */
const EDGE_FORM_POST_WINDOW_MS = LOOK_RATE_LIMIT_WINDOW_MS;
const EDGE_FORM_POST_MAX_PER_IP = 24;

const edgeFormPostLimiter = new SlidingWindowLimiter(
  EDGE_FORM_POST_WINDOW_MS,
  EDGE_FORM_POST_MAX_PER_IP,
);

export const PAID_LOOK_UPLOAD_RATE_WINDOW_MS = 60 * 60 * 1000;
export const PAID_LOOK_UPLOAD_RATE_MAX_PER_IP = 3;

export const paidLookUploadIpLimiter = new SlidingWindowLimiter(
  PAID_LOOK_UPLOAD_RATE_WINDOW_MS,
  PAID_LOOK_UPLOAD_RATE_MAX_PER_IP,
);

export function middlewareClientIp(headerList: Headers): string {
  const real = headerList.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export function consumeEdgeFormPost(ip: string): boolean {
  return edgeFormPostLimiter.consume(`edge-ip:${ip}`);
}

export function consumeFormSubmitLimits(ip: string, email: string): boolean {
  const emailKey = email.toLowerCase().trim() || "unknown";
  return (
    lookIpLimiter.consume(`ip:${ip}`) &&
    lookEmailLimiter.consume(`email:${emailKey}`)
  );
}

export function consumePaidLookUploadLimit(ip: string): boolean {
  return paidLookUploadIpLimiter.consume(`upload-ip:${ip}`);
}