import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { sessionCanAccessJob } from "@/lib/portal/access";
import { getJob } from "@/lib/portal/demo-data";
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

/** Loads a job the current session may view; buyers only see their customer’s jobs. */
export async function requireJob(jobId: string) {
  const session = await requireSession();
  const job = getJob(jobId);
  if (!job || !sessionCanAccessJob(session, jobId)) notFound();
  return { session, job };
}

export async function requireJobForShop(jobId: string) {
  const result = await requireJob(jobId);
  if (result.session.role !== "shop") redirect("/dashboard");
  return result;
}
