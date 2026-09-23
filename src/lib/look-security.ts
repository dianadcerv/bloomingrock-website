import { createHmac, timingSafeEqual } from "node:crypto";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOOK_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const LOOK_RATE_LIMIT_MAX_PER_IP = 5;
export const LOOK_EMAIL_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const LOOK_EMAIL_LIMIT_MAX = 3;
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

export class SlidingWindowLimiter {
  private readonly windowMs: number;
  private readonly max: number;
  private readonly store: Map<string, number[]>;

  constructor(windowMs: number, max: number, store = new Map<string, number[]>()) {
    this.windowMs = windowMs;
    this.max = max;
    this.store = store;
  }

  consume(key: string, now = Date.now()): boolean {
    const recent = (this.store.get(key) ?? []).filter((ts) => now - ts < this.windowMs);
    if (recent.length >= this.max) {
      this.store.set(key, recent);
      return false;
    }
    recent.push(now);
    this.store.set(key, recent);
    return true;
  }
}

export const lookIpLimiter = new SlidingWindowLimiter(
  LOOK_RATE_LIMIT_WINDOW_MS,
  LOOK_RATE_LIMIT_MAX_PER_IP,
);
export const lookEmailLimiter = new SlidingWindowLimiter(
  LOOK_EMAIL_LIMIT_WINDOW_MS,
  LOOK_EMAIL_LIMIT_MAX,
);

function tokenSecret() {
  return (
    process.env.FORM_TOKEN_SECRET?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    "bloomingrock-form-token"
  );
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

export function createFormToken(now = Date.now(), secret = tokenSecret()) {
  const payload = String(now);
  return `${payload}.${signPayload(payload, secret)}`;
}

export function verifyFormToken(
  token: string,
  {
    now = Date.now(),
    secret = tokenSecret(),
    minAgeMs = FORM_TOKEN_MIN_AGE_MS,
    maxAgeMs = FORM_TOKEN_MAX_AGE_MS,
  }: {
    now?: number;
    secret?: string;
    minAgeMs?: number;
    maxAgeMs?: number;
  } = {},
) {
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !/^\d+$/.test(payload)) return false;
  if (!safeEqual(sig, signPayload(payload, secret))) return false;

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

  if (!secret && !siteKey) return true;
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
