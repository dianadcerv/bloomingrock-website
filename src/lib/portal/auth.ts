import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  readSessionToken,
  SESSION_COOKIE,
  type PortalRole,
  type PortalSession,
} from "@/lib/portal/session";

export async function getSession(): Promise<PortalSession | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return readSessionToken(value);
}

export async function requireSession(): Promise<PortalSession> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(role: PortalRole): Promise<PortalSession> {
  const session = await requireSession();
  if (session.role !== role) redirect("/dashboard");
  return session;
}
