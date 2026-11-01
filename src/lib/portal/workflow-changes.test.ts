import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEMO_CUSTOMERS, getJob, getProject } from "./demo-data.ts";
import { normalizeEmail } from "./session.ts";

type WorkflowChangeProposal = {
  jobId: string;
  status: "pending" | "approved" | "rejected-in-discussion";
  proposerEmail: string;
  shopApproved: boolean;
  customerApproved: boolean;
  comments: { authorEmail: string }[];
};

const SHOP_ENGINEER_EMAIL = "maya@northridge.demo";

function pendingApproverEmail(change: WorkflowChangeProposal): string | null {
  if (change.status !== "pending") return null;
  if (!change.shopApproved) return SHOP_ENGINEER_EMAIL;
  if (!change.customerApproved) {
    const job = getJob(change.jobId);
    if (!job) return null;
    const project = getProject(job.projectId);
    const customer = DEMO_CUSTOMERS.find((c) => c.id === project?.customerId);
    return customer?.email ?? null;
  }
  return null;
}

function notificationRecipientsForChange(change: WorkflowChangeProposal): string[] {
  const emails = new Set<string>();
  emails.add(normalizeEmail(change.proposerEmail));
  for (const comment of change.comments) {
    emails.add(normalizeEmail(comment.authorEmail));
  }
  const approver = pendingApproverEmail(change);
  if (approver) emails.add(normalizeEmail(approver));
  return [...emails];
}

describe("workflow notification recipients", () => {
  it("notifies only thread participants, not other job viewers", () => {
    const jordanChange: WorkflowChangeProposal = {
      jobId: "access-platform",
      status: "pending",
      proposerEmail: "jordan@meridian.demo",
      shopApproved: false,
      customerApproved: true,
      comments: [
        { authorEmail: "jordan@meridian.demo" },
        { authorEmail: "maya@northridge.demo" },
      ],
    };
    const recipients = notificationRecipientsForChange(jordanChange);
    assert.ok(recipients.includes("jordan@meridian.demo"));
    assert.ok(recipients.includes("maya@northridge.demo"));
    assert.equal(recipients.includes("alex@harborview.demo"), false);
  });

  it("includes rejected-in-discussion commenters without notifying outsiders", () => {
    const rejected: WorkflowChangeProposal = {
      jobId: "machine-guard",
      status: "rejected-in-discussion",
      proposerEmail: "jordan@meridian.demo",
      shopApproved: false,
      customerApproved: true,
      comments: [
        { authorEmail: "jordan@meridian.demo" },
        { authorEmail: "maya@northridge.demo" },
      ],
    };
    const recipients = notificationRecipientsForChange(rejected);
    assert.ok(recipients.includes("jordan@meridian.demo"));
    assert.ok(recipients.includes("maya@northridge.demo"));
    assert.equal(recipients.includes("alex@harborview.demo"), false);
  });
});
