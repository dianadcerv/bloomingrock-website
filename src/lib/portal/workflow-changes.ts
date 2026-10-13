import { getCustomerForJob, getJob } from "./demo-data";
import { normalizeEmail } from "./session";

export type WorkflowSide = "shop" | "customer";

export type WorkflowChangeKind = "add-step" | "remove-step";

export type WorkflowChangeComment = {
  id: string;
  at: string;
  authorName: string;
  authorEmail: string;
  body: string;
  /** First comment when a side rejects — required before rejection applies. */
  isRejection?: boolean;
};

export type WorkflowChangeStatus = "pending" | "approved" | "rejected-in-discussion";

export type WorkflowChangeProposal = {
  id: string;
  jobId: string;
  kind: WorkflowChangeKind;
  status: WorkflowChangeStatus;
  /** Highlight as NEW until both sides approve (pending only). */
  isNew: boolean;
  proposerSide: WorkflowSide;
  proposerName: string;
  proposerEmail: string;
  shopApproved: boolean;
  customerApproved: boolean;
  stepLabel: string;
  stepId?: string;
  targetStepId?: string;
  targetStepLabel?: string;
  comments: WorkflowChangeComment[];
  createdAt: string;
};

export type DashboardNotification = {
  id: string;
  changeId: string;
  jobId: string;
  jobName: string;
  title: string;
  detail: string;
  href: string;
  createdAt: string;
  /** Only these emails see dashboard + email preview — active thread participants. */
  recipientEmails: string[];
  emailSubject: string;
  emailBodyPreview: string;
};

export type CategoryWorkflowSuggestion = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  fromCommentId: string;
  jobId: string;
  jobName: string;
  summary: string;
  suggestedStepLabel: string;
  status: "suggested";
};

const SHOP_ENGINEER_EMAIL = "maya@northridge.demo";

export const WORKFLOW_CHANGE_PROPOSALS: WorkflowChangeProposal[] = [
  {
    id: "wf-ch-jordan-qa",
    jobId: "access-platform",
    kind: "add-step",
    status: "pending",
    isNew: true,
    proposerSide: "customer",
    proposerName: "Jordan Hale",
    proposerEmail: "jordan@meridian.demo",
    shopApproved: false,
    customerApproved: true,
    stepLabel: "Specialized part review with Meridian QA",
    comments: [
      {
        id: "c-j-1",
        at: "Oct 12, 2026 9:10 AM CT",
        authorName: "Jordan Hale",
        authorEmail: "jordan@meridian.demo",
        body: "We need QA to sign off on the specialized guard interface before you release fab drawings.",
      },
      {
        id: "c-j-2",
        at: "Oct 12, 2026 2:40 PM CT",
        authorName: "Maya Chen",
        authorEmail: "maya@northridge.demo",
        body: "Makes sense — I'll confirm this is an acceptable step on our side once you approve wording.",
      },
    ],
    createdAt: "Oct 12, 2026 9:05 AM CT",
  },
  {
    id: "wf-ch-maya-remove-eng",
    jobId: "warehouse-b-stair",
    kind: "remove-step",
    status: "pending",
    isNew: true,
    proposerSide: "shop",
    proposerName: "Maya Chen",
    proposerEmail: "maya@northridge.demo",
    shopApproved: true,
    customerApproved: false,
    stepLabel: "",
    targetStepId: "eng-review",
    targetStepLabel: "Engineering review",
    comments: [
      {
        id: "c-h-1",
        at: "Oct 11, 2026 4:00 PM CT",
        authorName: "Maya Chen",
        authorEmail: "maya@northridge.demo",
        body: "Harborview already has stamped calcs from their architect — propose dropping duplicate eng review if you agree.",
      },
    ],
    createdAt: "Oct 11, 2026 3:55 PM CT",
  },
  {
    id: "wf-ch-jordan-ehs-rejected",
    jobId: "machine-guard",
    kind: "add-step",
    status: "rejected-in-discussion",
    isNew: false,
    proposerSide: "customer",
    proposerName: "Jordan Hale",
    proposerEmail: "jordan@meridian.demo",
    shopApproved: false,
    customerApproved: true,
    stepLabel: "Meridian EHS sign-off on guard opening",
    comments: [
      {
        id: "c-g-1",
        at: "Oct 10, 2026 11:00 AM CT",
        authorName: "Jordan Hale",
        authorEmail: "jordan@meridian.demo",
        body: "EHS wants a formal sign-off on the guard opening size before we lock the infeed layout.",
      },
      {
        id: "c-g-reject",
        at: "Oct 10, 2026 1:15 PM CT",
        authorName: "Maya Chen",
        authorEmail: "maya@northridge.demo",
        isRejection: true,
        body: "Rejecting as proposed — we need opening dimensions first, and EHS sign-off overlaps with our engineering review step. Let's agree on scope in this thread.",
      },
      {
        id: "c-g-2",
        at: "Oct 10, 2026 2:05 PM CT",
        authorName: "Jordan Hale",
        authorEmail: "jordan@meridian.demo",
        body: "Fair — can we combine EHS + engineering into one 'Joint safety review' step after opening size is confirmed?",
      },
      {
        id: "c-g-3",
        at: "Oct 10, 2026 3:30 PM CT",
        authorName: "Maya Chen",
        authorEmail: "maya@northridge.demo",
        body: "Yes. Submit a new add-step proposal with that title once opening size is on the checklist — we'll both approve.",
      },
    ],
    createdAt: "Oct 10, 2026 10:55 AM CT",
  },
];

export const CATEGORY_WORKFLOW_SUGGESTIONS: CategoryWorkflowSuggestion[] = [
  {
    id: "cat-sug-qa",
    categoryId: "access-platforms",
    categoryLabel: "Access platforms",
    fromCommentId: "c-j-1",
    jobId: "access-platform",
    jobName: "Industrial access platform",
    summary: "Customer QA review step before fab release (from Jordan / Meridian thread).",
    suggestedStepLabel: "Customer QA review on specialized interfaces",
    status: "suggested",
  },
  {
    id: "cat-sug-walk",
    categoryId: "access-platforms",
    categoryLabel: "Access platforms",
    fromCommentId: "c-walk-seed",
    jobId: "access-platform",
    jobName: "Industrial access platform",
    summary: "Site walk to confirm dimensions appears often in platform job comments.",
    suggestedStepLabel: "Confirm site dimensions on a walk",
    status: "suggested",
  },
];

/** Who must approve next on the opposite side from a pending change. */
export function pendingApproverEmail(change: WorkflowChangeProposal): string | null {
  if (change.status !== "pending") return null;
  if (!change.shopApproved) return SHOP_ENGINEER_EMAIL;
  if (!change.customerApproved) {
    const customer = getCustomerForJob(getJob(change.jobId)!);
    return customer?.email ?? null;
  }
  return null;
}

/**
 * Dashboard + email notifications go only to the proposer, everyone who commented,
 * and whoever must approve next — not to other users with job access.
 * Every event is still written to the audit log separately.
 */
export function notificationRecipientsForChange(change: WorkflowChangeProposal): string[] {
  const emails = new Set<string>();
  emails.add(normalizeEmail(change.proposerEmail));
  for (const comment of change.comments) {
    emails.add(normalizeEmail(comment.authorEmail));
  }
  const approver = pendingApproverEmail(change);
  if (approver) emails.add(normalizeEmail(approver));
  return [...emails];
}

function buildNotifications(): DashboardNotification[] {
  const items: DashboardNotification[] = [];
  for (const change of WORKFLOW_CHANGE_PROPOSALS) {
    if (change.status !== "pending" && change.status !== "rejected-in-discussion") continue;
    const job = getJob(change.jobId);
    if (!job) continue;
    const recipients = notificationRecipientsForChange(change);
    const title =
      change.status === "rejected-in-discussion"
        ? `Rejected, in discussion: ${change.stepLabel || change.targetStepLabel || "workflow change"}`
        : change.kind === "add-step"
          ? `Approve new workflow step: ${change.stepLabel}`
          : `Approve removing step: ${change.targetStepLabel ?? "step"}`;
    const detail =
      change.status === "rejected-in-discussion"
        ? `${job.name} — reply on the open thread to decide next steps.`
        : change.proposerSide === "customer"
          ? `${change.proposerName} proposed a change on ${job.name}. Your approval is needed.`
          : `${change.proposerName} proposed a change on ${job.name}. Customer approval is needed.`;
    items.push({
      id: `n-${change.id}`,
      changeId: change.id,
      jobId: change.jobId,
      jobName: job.name,
      title,
      detail,
      href: `/jobs/${change.jobId}/workflow#change-${change.id}`,
      createdAt: change.createdAt,
      recipientEmails: recipients,
      emailSubject: `[Northridge Steel] Workflow: ${job.name}`,
      emailBodyPreview: `${title}\n\n${detail}\n\nOpen the job workflow to review the thread.\n\n— Email notification (demo, not sent)`,
    });
  }
  return items;
}

const ALL_NOTIFICATIONS = buildNotifications();

export function getDashboardNotificationsForEmail(email: string) {
  const normalized = normalizeEmail(email);
  return ALL_NOTIFICATIONS.filter((n) =>
    n.recipientEmails.some((r) => normalizeEmail(r) === normalized),
  );
}

export function getEmailOutboxForEmail(email: string) {
  return getDashboardNotificationsForEmail(email);
}

export function proposalsForJob(jobId: string) {
  return WORKFLOW_CHANGE_PROPOSALS.filter((c) => c.jobId === jobId);
}

export function categorySuggestions(categoryId: string) {
  return CATEGORY_WORKFLOW_SUGGESTIONS.filter((c) => c.categoryId === categoryId);
}
