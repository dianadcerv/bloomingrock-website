import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "br_portal";
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PortalRole = "shop" | "buyer";

export type PortalUser = {
  email: string;
  role: PortalRole;
  name: string;
  org: string;
  title: string;
};

export type PortalSession = PortalUser & {
  exp: number;
};

function secret() {
  return (
    process.env.PORTAL_SESSION_SECRET?.trim() ||
    process.env.FORM_TOKEN_SECRET?.trim() ||
    "bloomingrock-portal-demo"
  );
}

function signPayload(payload: string, key = secret()) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function encode(data: Record<string, unknown>, key = secret()) {
  const payload = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  return `${payload}.${signPayload(payload, key)}`;
}

function decode<T>(token: string, key = secret()): T | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!safeEqual(sig, signPayload(payload, key))) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export const DEMO_USERS: readonly PortalUser[] = [
  {
    email: "maya@northridge.demo",
    role: "shop",
    name: "Maya Chen",
    org: "Northridge Steel",
    title: "Estimator",
  },
  {
    email: "jordan@meridian.demo",
    role: "buyer",
    name: "Jordan Hale",
    org: "Meridian Food Plants",
    title: "Plant engineer",
  },
] as const;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function findDemoUser(email: string) {
  const normalized = normalizeEmail(email);
  return DEMO_USERS.find((user) => user.email === normalized) ?? null;
}

export function createMagicToken(
  email: string,
  now = Date.now(),
  key = secret(),
) {
  return encode(
    {
      typ: "magic",
      email: normalizeEmail(email),
      exp: now + MAGIC_LINK_TTL_MS,
    },
    key,
  );
}

export function consumeMagicToken(
  token: string,
  now = Date.now(),
  key = secret(),
): PortalUser | null {
  const data = decode<{ typ?: string; email?: string; exp?: number }>(token, key);
  if (!data || data.typ !== "magic" || !data.email || !data.exp) return null;
  if (now > data.exp) return null;
  return findDemoUser(data.email);
}

export function createSessionToken(
  user: PortalUser,
  now = Date.now(),
  key = secret(),
) {
  return encode(
    {
      typ: "session",
      email: user.email,
      role: user.role,
      name: user.name,
      org: user.org,
      title: user.title,
      exp: now + SESSION_TTL_MS,
    },
    key,
  );
}

export function readSessionToken(
  token: string,
  now = Date.now(),
  key = secret(),
): PortalSession | null {
  const data = decode<PortalSession & { typ?: string }>(token, key);
  if (!data || data.typ !== "session" || !data.email || !data.exp) return null;
  if (now > data.exp) return null;
  if (data.role !== "shop" && data.role !== "buyer") return null;
  return {
    email: data.email,
    role: data.role,
    name: data.name,
    org: data.org,
    title: data.title,
    exp: data.exp,
  };
}

export function sessionCookieOptions(maxAgeSec = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}
