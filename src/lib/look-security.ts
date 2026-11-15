import { createHmac, timingSafeEqual } from "node:crypto";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export {
  FORM_SUBMIT_RATE_LIMIT_ERROR,
  LOOK_EMAIL_LIMIT_MAX,
  LOOK_EMAIL_LIMIT_WINDOW_MS,
  LOOK_RATE_LIMIT_MAX_PER_IP,
  LOOK_RATE_LIMIT_WINDOW_MS,
} from "@/lib/form-rate-limit";

export const FORM_TOKEN_MIN_AGE_MS = 2_500;
export const FORM_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function sanitizeOneLine(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

export function sanitizeMultiline(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim();
}

export function isValidEmail(value: string) {
  const email = sanitizeOneLine(value);
  return EMAIL_PATTERN.test(email) && email.length <= 120 && !email.includes(" ");
}

export function normalizeWebsite(value: string): { ok: true; url: string } | { ok: false } {
  const cleaned = sanitizeOneLine(value);
  if (!cleaned) return { ok: true, url: "" };

  const withScheme = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false };
  }
  if (parsed.username || parsed.password) {
    return { ok: false };
  }
  if (!parsed.hostname || parsed.hostname.includes(" ")) {
    return { ok: false };
  }

  return { ok: true, url: parsed.toString() };
}

export { SlidingWindowLimiter } from "@/lib/sliding-window-limiter";

let loggedMissingFormTokenSecret = false;

function tokenSecret(): string | null {
  const explicit = process.env.FORM_TOKEN_SECRET?.trim();
  if (explicit) return explicit;

  if (process.env.NODE_ENV === "production") {
    if (!loggedMissingFormTokenSecret) {
      console.error(
        "[form-security] FORM_TOKEN_SECRET is not set in production; form tokens are disabled.",
      );
      loggedMissingFormTokenSecret = true;
    }
    return null;
  }

  return process.env.RESEND_API_KEY?.trim() || "bloomingrock-form-token-dev-only";
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 24);
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createFormToken(now = Date.now(), secret?: string | null) {
  const resolved = secret ?? tokenSecret();
  if (!resolved) return "0.invalid";
  const payload = String(now);
  return `${payload}.${signPayload(payload, resolved)}`;
}

async function runtimeTokenSecret() {
  const { connection } = await import("next/server");
  await connection();
  return tokenSecret();
}

/** Mint a token at request time so signing uses runtime env (not build-inlined secrets). */
export async function mintFormToken() {
  const secret = await runtimeTokenSecret();
  return createFormToken(Date.now(), secret);
}

/** Validate a submitted token using the same runtime secret as page render. */
export async function validateFormToken(token: string) {
  const secret = await runtimeTokenSecret();
  return verifyFormToken(token, { secret, now: Date.now() });
}

export function verifyFormToken(
  token: string,
  {
    now = Date.now(),
    secret,
    minAgeMs = FORM_TOKEN_MIN_AGE_MS,
    maxAgeMs = FORM_TOKEN_MAX_AGE_MS,
  }: {
    now?: number;
    secret?: string | null;
    minAgeMs?: number;
    maxAgeMs?: number;
  } = {},
) {
  const resolved = secret ?? tokenSecret();
  if (!resolved) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig || !/^\d+$/.test(payload)) return false;
  if (!safeEqual(sig, signPayload(payload, resolved))) return false;

  const createdAt = Number(payload);
  const age = now - createdAt;
  return age >= minAgeMs && age <= maxAgeMs;
}

export function clientIp(headerList: Headers) {
  const real = headerList.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!secret || !siteKey) return false;
  } else if (!secret && !siteKey) {
    return true;
  }
  if (!secret || !token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
