import {
  DEMO_CUSTOMERS,
  getJob,
  getProject,
  JOBS,
  type DemoJob,
} from "./demo-data";
import { normalizeEmail, type PortalSession } from "./session";

export function buyerCustomerIdForEmail(email: string) {
  const normalized = normalizeEmail(email);
  return DEMO_CUSTOMERS.find((c) => c.email === normalized)?.id ?? null;
}

export function jobCustomerId(job: DemoJob) {
  const project = getProject(job.projectId);
  return project?.customerId ?? null;
}

export function sessionCanAccessJob(session: PortalSession, jobId: string) {
  const job = getJob(jobId);
  if (!job) return false;
  if (session.role === "shop") return true;
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return false;
  return jobCustomerId(job) === buyerCustomerId;
}

export function jobsForSession(session: PortalSession) {
  if (session.role === "shop") return JOBS;
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return [];
  return JOBS.filter((job) => jobCustomerId(job) === buyerCustomerId);
}
