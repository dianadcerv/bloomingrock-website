import type { PortalSession } from "@/lib/portal/session";
import { jobsForSession } from "./access";
import type { AuditEntry, DemoJob, StatusPillTone } from "./demo-data";
import {
  DEMO_CUSTOMERS,
  getCustomerForJob,
  getProjectForJob,
  INBOX_ITEMS,
  JOBS,
  jobOwnerRole,
  jobStatusLabel,
  jobStatusPillTone,
} from "./demo-data";

export type SummaryTile = {
  id: string;
  label: string;
  shortLabel: string;
  count: number;
  href: string;
  tone: StatusPillTone;
};

export type AttentionRow = {
  id: string;
  urgency: number;
  title: string;
  detail: string;
  statusLabel: string;
  tone: StatusPillTone;
  actionLabel: string;
  href: string;
};

export type WorkJobRow = {
  jobId: string;
  customer: string;
  customerId: string;
  project: string;
  jobName: string;
  status: DemoJob["status"];
  statusLabel: string;
  tone: StatusPillTone;
  ownerRole: string;
  stageSince: string;
};

function countNeedsReview(jobs: DemoJob[]) {
  return jobs.reduce(
    (n, job) => n + job.checklist.filter((c) => c.reviewState === "needs-review").length,
    0,
  );
}

function countDraftQuestions(jobs: DemoJob[]) {
  return jobs.reduce((n, job) => n + job.questions.length, 0);
}

export function getShopSummaryTiles(): SummaryTile[] {
  const conflictJobs = JOBS.filter((j) => j.status === "conflict" || j.conflicts.length > 0);
  const waitingJobs = JOBS.filter((j) => j.status === "waiting-on-customer");
  const needsReview = countNeedsReview(JOBS);
  const drafts = countDraftQuestions(JOBS);

  return [
    {
      id: "inbox",
      label: "New emails to match",
      shortLabel: "Emails",
      count: INBOX_ITEMS.length,
      href: "/inbox",
      tone: "draft",
    },
    {
      id: "conflicts",
      label: "Conflicts",
      shortLabel: "Conflicts",
      count: conflictJobs.length,
      href: "/jobs?status=conflict",
      tone: "conflict",
    },
    {
      id: "review",
      label: "Items needing review",
      shortLabel: "Review",
      count: needsReview,
      href: "/jobs?filter=needs-review",
      tone: "assumed",
    },
    {
      id: "waiting",
      label: "Waiting on customer",
      shortLabel: "Waiting",
      count: waitingJobs.length,
      href: "/jobs?status=waiting-on-customer",
      tone: "missing",
    },
    {
      id: "drafts",
      label: "Drafts ready to send",
      shortLabel: "Drafts",
      count: drafts,
      href: "/jobs?filter=drafts",
      tone: "draft",
    },
  ];
}

export function getShopAttentionItems(limit?: number): AttentionRow[] {
  const platform = JOBS.find((j) => j.id === "access-platform")!;
  const guard = JOBS.find((j) => j.id === "machine-guard")!;
  const stair = JOBS.find((j) => j.id === "warehouse-b-stair")!;

  const rows: AttentionRow[] = [
    {
      id: "att-in-1",
      urgency: 1,
      title: "Confirm inbox match",
      detail: "Need a platform off Line 3 — Meridian Food Plants",
      statusLabel: "Needs confirm",
      tone: "draft",
      actionLabel: "Confirm match",
      href: "/inbox/in-1",
    },
    {
      id: "att-conflict",
      urgency: 2,
      title: "Resolve conflict",
      detail: `${platform.name}: clear width 48 in. vs 54 in.`,
      statusLabel: jobStatusLabel(platform.status),
      tone: jobStatusPillTone(platform.status),
      actionLabel: "Resolve conflict",
      href: "/jobs/access-platform",
    },
    {
      id: "att-review-platform",
      urgency: 3,
      title: "Review AI suggestions",
      detail: `${platform.name}: ${platform.checklist.filter((c) => c.reviewState === "needs-review").length} checklist lines need a person`,
      statusLabel: "Needs review",
      tone: "assumed",
      actionLabel: "Review",
      href: "/jobs/access-platform",
    },
    {
      id: "att-in-2",
      urgency: 4,
      title: "Confirm dual job match",
      detail: "Small guard email attaches to platform + guard",
      statusLabel: "Needs confirm",
      tone: "draft",
      actionLabel: "Confirm match",
      href: "/inbox/in-2",
    },
    {
      id: "att-waiting",
      urgency: 5,
      title: "Waiting on customer",
      detail: `${guard.name}: opening size missing`,
      statusLabel: jobStatusLabel(guard.status),
      tone: jobStatusPillTone(guard.status),
      actionLabel: "Review",
      href: "/jobs/machine-guard",
    },
    {
      id: "att-drafts",
      urgency: 6,
      title: "Send customer draft",
      detail: "Width + load rating questions drafted, not sent",
      statusLabel: "DRAFT, NOT SENT",
      tone: "draft",
      actionLabel: "Send draft",
      href: "/jobs/access-platform/missing",
    },
    {
      id: "att-stair",
      urgency: 7,
      title: "Engineering review",
      detail: `${stair.name}: ready for sign-off after load rating`,
      statusLabel: jobStatusLabel(stair.status),
      tone: jobStatusPillTone(stair.status),
      actionLabel: "Review",
      href: "/jobs/warehouse-b-stair/workflow",
    },
  ];

  return limit ? rows.slice(0, limit) : rows;
}

export function getWorkInProgressRows(customerId?: string): WorkJobRow[] {
  return JOBS.filter((job) => {
    if (!customerId || customerId === "all") return true;
    const customer = getCustomerForJob(job);
    return customer?.id === customerId;
  }).map((job) => {
    const customer = getCustomerForJob(job);
    const project = getProjectForJob(job);
    return {
      jobId: job.id,
      customer: customer?.name ?? "—",
      customerId: customer?.id ?? "",
      project: project?.name ?? "—",
      jobName: job.name,
      status: job.status,
      statusLabel: jobStatusLabel(job.status),
      tone: jobStatusPillTone(job.status),
      ownerRole: jobOwnerRole(job),
      stageSince: job.stageSince,
    };
  });
}

export function groupJobsByStage(rows: WorkJobRow[]) {
  const map = new Map<string, WorkJobRow[]>();
  for (const row of rows) {
    const key = row.statusLabel;
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }
  return [...map.entries()];
}

export function getRecentAuditAcrossJobs(limit = 7): (AuditEntry & { jobId: string; jobName: string })[] {
  const merged = JOBS.flatMap((job) =>
    job.auditLog.map((entry) => ({
      ...entry,
      jobId: job.id,
      jobName: job.name,
    })),
  );
  return merged
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, limit);
}

export function getCustomerSummaryTiles(session: PortalSession): SummaryTile[] {
  const jobs = jobsForSession(session);
  const waiting = jobs.filter((j) => j.status === "waiting-on-customer").length;
  const ready = jobs.filter((j) => j.status === "ready-for-signoff").length;
  return [
    {
      id: "jobs",
      label: "Your jobs",
      shortLabel: "Jobs",
      count: jobs.length,
      href: "/jobs",
      tone: "draft",
    },
    {
      id: "waiting-you",
      label: "Waiting on you",
      shortLabel: "Action",
      count: getCustomerWaitingItems(session).length,
      href: "#waiting-on-you",
      tone: waiting > 0 ? "missing" : "ok",
    },
    {
      id: "signoff",
      label: "Ready for sign-off",
      shortLabel: "Sign-off",
      count: ready,
      href: "/documents",
      tone: ready > 0 ? "ok" : "draft",
    },
  ];
}

export function getCustomerWaitingItems(session: PortalSession): AttentionRow[] {
  const jobs = jobsForSession(session);
  const rows: AttentionRow[] = [];

  for (const job of jobs) {
    if (job.status === "waiting-on-customer") {
      rows.push({
        id: `wait-${job.id}`,
        urgency: 1,
        title: "Provide missing information",
        detail: job.summary,
        statusLabel: jobStatusLabel(job.status),
        tone: jobStatusPillTone(job.status),
        actionLabel: "View job",
        href: `/jobs/${job.id}`,
      });
    }
    if (job.status === "ready-for-signoff") {
      rows.push({
        id: `sign-${job.id}`,
        urgency: 2,
        title: "Review requirements sign-off",
        detail: `${job.name} — secure link and one-time code when Northridge sends invite`,
        statusLabel: jobStatusLabel(job.status),
        tone: jobStatusPillTone(job.status),
        actionLabel: "Open sign-off",
        href: `/jobs/${job.id}/sign-off`,
      });
    }
    for (const q of job.questions) {
      if (q.askedOf === "customer") {
        rows.push({
          id: `req-${q.id}`,
          urgency: 3,
          title: "Upcoming request from Northridge",
          detail: `${q.prompt} (draft on shop side — not sent yet)`,
          statusLabel: "Not sent",
          tone: "draft",
          actionLabel: "View requests",
          href: "/requests",
        });
      }
    }
  }

  return rows.sort((a, b) => a.urgency - b.urgency);
}

export function getCustomerJobRows(session: PortalSession): WorkJobRow[] {
  return jobsForSession(session).map((job) => {
    const customer = getCustomerForJob(job);
    const project = getProjectForJob(job);
    return {
      jobId: job.id,
      customer: customer?.name ?? session.org,
      customerId: customer?.id ?? "",
      project: project?.name ?? "—",
      jobName: job.name,
      status: job.status,
      statusLabel: jobStatusLabel(job.status),
      tone: jobStatusPillTone(job.status),
      ownerRole: jobOwnerRole(job),
      stageSince: job.stageSince,
    };
  });
}

export const CUSTOMER_FILTER_OPTIONS = [
  { id: "all", label: "All customers" },
  ...DEMO_CUSTOMERS.map((c) => ({ id: c.id, label: c.name })),
];
