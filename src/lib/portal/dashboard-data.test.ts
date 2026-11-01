import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEMO_CUSTOMERS, getJob, getProject, JOBS } from "./demo-data.ts";
import { normalizeEmail } from "./session.ts";

function buyerCustomerIdForEmail(email: string) {
  const normalized = normalizeEmail(email);
  return DEMO_CUSTOMERS.find((c) => c.email === normalized)?.id ?? null;
}

function jobCustomerId(job: NonNullable<ReturnType<typeof getJob>>) {
  const project = getProject(job.projectId);
  return project?.customerId ?? null;
}

function jobsForSession(session: { role: string; email: string }) {
  if (session.role === "shop") return JOBS;
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return [];
  return JOBS.filter((job) => jobCustomerId(job) === buyerCustomerId);
}

/** Mirrors getCustomerWaitingItems question filtering for buyer isolation. */
function customerQuestionWaitingIds(session: { role: string; email: string }) {
  const rows: string[] = [];
  for (const job of jobsForSession(session)) {
    for (const q of job.questions) {
      if (q.askedOf === "customer" && q.sent) {
        rows.push(`req-${q.id}`);
      }
    }
  }
  return rows;
}

describe("buyer waiting items — question drafts", () => {
  it("does not surface unsent shop question drafts", () => {
    const session = { email: "jordan@meridian.demo", role: "buyer" as const };
    assert.deepEqual(customerQuestionWaitingIds(session), []);
    assert.ok(
      jobsForSession(session).some((j) =>
        j.questions.some((q) => q.askedOf === "customer" && !q.sent),
      ),
      "demo still has unsent drafts for shop-only visibility",
    );
  });
});
