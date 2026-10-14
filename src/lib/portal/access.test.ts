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

function sessionCanAccessJob(
  session: { role: string; email: string },
  jobId: string,
) {
  const job = getJob(jobId);
  if (!job) return false;
  if (session.role === "shop" || session.role === "shop-admin" || session.role === "superadmin") return true;
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return false;
  return jobCustomerId(job) === buyerCustomerId;
}

function jobsForSession(session: { role: string; email: string }) {
  if (session.role === "shop" || session.role === "shop-admin" || session.role === "superadmin") return JOBS;
  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  if (!buyerCustomerId) return [];
  return JOBS.filter((job) => jobCustomerId(job) === buyerCustomerId);
}

describe("buyer job access", () => {
  it("scopes jobs per customer login", () => {
    const jordan = {
      email: "jordan@meridian.demo",
      role: "buyer" as const,
    };
    const alex = {
      email: "alex@harborview.demo",
      role: "buyer" as const,
    };

    assert.equal(buyerCustomerIdForEmail(jordan.email), "meridian");
    assert.equal(buyerCustomerIdForEmail(alex.email), "harborview");

    assert.equal(sessionCanAccessJob(jordan, "access-platform"), true);
    assert.equal(sessionCanAccessJob(jordan, "warehouse-b-stair"), false);
    assert.equal(sessionCanAccessJob(alex, "warehouse-b-stair"), true);
    assert.equal(sessionCanAccessJob(alex, "machine-guard"), false);

    assert.equal(jobsForSession(jordan).length, 2);
    assert.equal(jobsForSession(alex).length, 1);
    assert.ok(jobsForSession(alex).some((j) => j.id === "warehouse-b-stair"));
  });

  it("maps harbor job to harborview customer", () => {
    const job = getJob("warehouse-b-stair");
    assert.ok(job);
    assert.equal(jobCustomerId(job!), "harborview");
  });
});
