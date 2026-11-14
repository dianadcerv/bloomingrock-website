import {
  DEMO_CUSTOMERS,
  getJob,
  getProject,
  INBOX_ITEMS,
  JOBS,
  jobShopId,
  type DemoJob,
  type InboxItem,
} from "./demo-data";
import { jobBelongsToShop, shopIdForSession } from "./demo-shop";
import { isShopStaff } from "./roles";
import { normalizeEmail, type PortalSession } from "./session";

export function buyerCustomerIdForEmail(email: string) {
  const normalized = normalizeEmail(email);
  return DEMO_CUSTOMERS.find((c) => c.email === normalized)?.id ?? null;
}

export function jobCustomerId(job: DemoJob) {
  const project = getProject(job.projectId);
  return project?.customerId ?? null;
}

export function jobsInShop(session: PortalSession) {
  const shopId = shopIdForSession(session);
  if (!shopId) return JOBS;
  return JOBS.filter((job) => jobBelongsToShop(jobShopId(job), shopId));
}

export function inboxForSession(session: PortalSession): InboxItem[] {
  const shopId = shopIdForSession(session);
  if (!shopId) return INBOX_ITEMS;
  return INBOX_ITEMS.filter((item) => jobBelongsToShop(item.shopId ?? "northridge", shopId));
}

export function customersForSession(session: PortalSession) {
  const shopId = shopIdForSession(session);
  if (!shopId) return DEMO_CUSTOMERS;
  return DEMO_CUSTOMERS.filter(
    (customer) => jobBelongsToShop(customer.shopId ?? "northridge", shopId),
  );
}

export function sessionCanAccessJob(session: PortalSession, jobId: string) {
  const job = getJob(jobId);
  if (!job) return false;
  if (isShopStaff(session.role)) {
    const shopId = shopIdForSession(session);
    if (shopId && !jobBelongsToShop(jobShopId(job), shopId)) return false;
    return true;
  }
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return false;
  return jobCustomerId(job) === buyerCustomerId;
}

export function jobsForSession(session: PortalSession) {
  if (isShopStaff(session.role)) return jobsInShop(session);
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return [];
  return JOBS.filter((job) => jobCustomerId(job) === buyerCustomerId);
}
