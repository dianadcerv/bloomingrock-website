import type { PortalSession } from "@/lib/portal/session";
import { customersForSession, inboxForSession, jobsForSession, jobsInShop } from "./access";
import { shopIdForSession } from "./demo-shop";
import type { AuditEntry, DemoJob, StatusPillTone } from "./demo-data";
import {
  DEMO_CUSTOMER,
  DEMO_CUSTOMERS,
  DEMO_PROJECT,
  getCustomerForJob,
  getProjectForJob,
  JOBS,
  jobOwnerRole,
  jobStatusLabel,
  jobStatusPillTone,
} from "./demo-data";
import { getWorkflowWaitingAttention } from "./workflow-changes";

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

export function getShopSummaryTiles(session: PortalSession): SummaryTile[] {
  const jobs = jobsInShop(session);
  const inbox = inboxForSession(session);
  const conflictJobs = jobs.filter((j) => j.status === "conflict" || j.conflicts.length > 0);
  const waitingJobs = jobs.filter((j) => j.status === "waiting-on-customer");
  const needsReview = countNeedsReview(jobs);
  const drafts = countDraftQuestions(jobs);

  return [
    {
      id: "inbox",
      label: "New emails to match",
      shortLabel: "Emails",
      count: inbox.length,
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

function getHeaterShopAttentionItems(limit?: number): AttentionRow[] {
  const job = JOBS.find((j) => j.id === "lakeshore-cartridge-heaters")!;
  const rows: AttentionRow[] = [
    {
      id: "hc-att-in",
      urgency: 1,
      title: "Confirm inbox match",
      detail: "RFQ: 12 cartridge heaters — Lakeshore Mold Systems",
      statusLabel: "Needs confirm",
      tone: "draft",
      actionLabel: "Confirm match",
      href: "/inbox/hc-in-1",
    },
    {
      id: "hc-att-conflicts",
      urgency: 2,
      title: "Resolve RFQ conflicts",
      detail: `${job.name}: voltage, wattage, temp, leads, and hole fit across sources`,
      statusLabel: jobStatusLabel(job.status),
      tone: jobStatusPillTone(job.status),
      actionLabel: "Open job",
      href: "/jobs/lakeshore-cartridge-heaters",
    },
    {
      id: "hc-att-missing",
      urgency: 3,
      title: "Missing-info checklist",
      detail: "Prior part number, environment, new design vs replacement",
      statusLabel: "Missing",
      tone: "missing",
      actionLabel: "Review",
      href: "/jobs/lakeshore-cartridge-heaters/missing",
    },
    {
      id: "hc-att-drafts",
      urgency: 4,
      title: "Clarifying question drafts",
      detail: "Voltage, wattage/temp, hole, leads, prior part, UL — DRAFT, NOT SENT",
      statusLabel: "DRAFT, NOT SENT",
      tone: "draft",
      actionLabel: "Edit drafts",
      href: "/jobs/lakeshore-cartridge-heaters/missing",
    },
    {
      id: "hc-att-handoff",
      urgency: 5,
      title: "Ready for handoff (blocked)",
      detail: "Sign-off blocked until voltage, wattage/temp/material, hole fit, and leads are cleared",
      statusLabel: "Blocked",
      tone: "conflict",
      actionLabel: "Preview packet",
      href: "/jobs/lakeshore-cartridge-heaters/handoff",
    },
  ];
  return limit ? rows.slice(0, limit) : rows;
}

export function getShopAttentionItems(
  session: PortalSession,
  limit?: number,
): AttentionRow[] {
  if (shopIdForSession(session) === "heaterco") {
    return getHeaterShopAttentionItems(limit);
  }

  const shopEmail = session.email;
  const platform = JOBS.find((j) => j.id === "access-platform")!;
  const guard = JOBS.find((j) => j.id === "machine-guard")!;
  const stair = JOBS.find((j) => j.id === "warehouse-b-stair")!;
  const controlled = JOBS.find((j) => j.id === "itar-mezz-guard")!;

  const workflowRows: AttentionRow[] = getWorkflowWaitingAttention(shopEmail).map((wf) => ({
    id: wf.id,
    urgency: wf.urgency,
    title: wf.title,
    detail: wf.detail,
    statusLabel: wf.statusLabel,
    tone: wf.tone,
    actionLabel: wf.actionLabel,
    href: wf.href,
  }));

  const rows: AttentionRow[] = [
    ...workflowRows,
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
      id: "att-controlled",
      urgency: 2,
      title: "Possible controlled job",
      detail: `${controlled.name}: ITAR / export-controlled / CUI markings — not processed`,
      statusLabel: "Controlled",
      tone: "conflict",
      actionLabel: "Open job",
      href: "/jobs/itar-mezz-guard",
    },
    {
      id: "att-conflict",
      urgency: 3,
      title: "Resolve conflict",
      detail: `${platform.name}: clear width 48 in. vs 54 in.`,
      statusLabel: jobStatusLabel(platform.status),
      tone: jobStatusPillTone(platform.status),
      actionLabel: "Resolve conflict",
      href: "/jobs/access-platform",
    },
    {
      id: "att-review-platform",
      urgency: 4,
      title: "Review interpretations",
      detail: `${platform.name}: ${platform.checklist.filter((c) => c.reviewState === "needs-review").length} checklist lines need a person`,
      statusLabel: "Needs review",
      tone: "assumed",
      actionLabel: "Review",
      href: "/jobs/access-platform",
    },
    {
      id: "att-in-2",
      urgency: 5,
      title: "Confirm dual job match",
      detail: "Small guard email attaches to platform + guard",
      statusLabel: "Needs confirm",
      tone: "draft",
      actionLabel: "Confirm match",
      href: "/inbox/in-2",
    },
    {
      id: "att-waiting",
      urgency: 6,
      title: "Waiting on customer",
      detail: `${guard.name}: opening size missing`,
      statusLabel: jobStatusLabel(guard.status),
      tone: jobStatusPillTone(guard.status),
      actionLabel: "Review",
      href: "/jobs/machine-guard",
    },
    {
      id: "att-drafts",
      urgency: 7,
      title: "Send customer draft",
      detail: "Width + load rating questions drafted, not sent",
      statusLabel: "DRAFT, NOT SENT",
      tone: "draft",
      actionLabel: "Send draft",
      href: "/jobs/access-platform/missing",
    },
    {
      id: "att-stair",
      urgency: 8,
      title: "Sign-off invite sent",
      detail: `${stair.name}: automatic sign-off code emailed — review checklist on sign-off page`,
      statusLabel: jobStatusLabel(stair.status),
      tone: jobStatusPillTone(stair.status),
      actionLabel: "Review",
      href: "/jobs/warehouse-b-stair/workflow",
    },
  ];

  return limit ? rows.slice(0, limit) : rows;
}

export function getWorkInProgressRows(
  session: PortalSession,
  customerId?: string,
): WorkJobRow[] {
  return jobsInShop(session).filter((job) => {
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

export function getRecentAuditAcrossJobs(
  session: PortalSession,
  limit = 7,
): (AuditEntry & { jobId: string; jobName: string })[] {
  const merged = jobsInShop(session).flatMap((job) =>
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

  for (const wf of getWorkflowWaitingAttention(session.email)) {
    rows.push({
      id: wf.id,
      urgency: wf.urgency,
      title: wf.title,
      detail: wf.detail,
      statusLabel: wf.statusLabel,
      tone: wf.tone,
      actionLabel: wf.actionLabel,
      href: wf.href,
    });
  }

  for (const job of jobs) {
    if (job.status === "conflict") {
      const conflictDetail =
        job.id === "lakeshore-cartridge-heaters"
          ? `${job.name}: your shop is reconciling the RFQ sources before handoff to CPQ (demo).`
          : `${job.name}: your shop is reconciling sources before sign-off (demo: width conflict on the access platform).`;
      rows.push({
        id: `conflict-${job.id}`,
        urgency: 0,
        title: "Requirements under review",
        detail: conflictDetail,
        statusLabel: jobStatusLabel(job.status, {
          role: "buyer",
          buyerLabel: job.buyerStatusLabel,
        }),
        tone: jobStatusPillTone(job.status),
        actionLabel: "View status",
        href: `/jobs/${job.id}`,
      });
    }
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
        detail: `${job.name} — one-time code emailed automatically when requirements were marked ready`,
        statusLabel: jobStatusLabel(job.status),
        tone: jobStatusPillTone(job.status),
        actionLabel: "Open sign-off",
        href: `/jobs/${job.id}/sign-off`,
      });
    }
    for (const q of job.questions) {
      if (q.askedOf === "customer" && q.sent) {
        rows.push({
          id: `req-${q.id}`,
          urgency: 3,
          title: "Upcoming request from Northridge",
          detail: q.prompt,
          statusLabel: "Action needed",
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
      statusLabel: jobStatusLabel(job.status, {
        role: session.role === "buyer" ? "buyer" : undefined,
        buyerLabel: job.buyerStatusLabel,
      }),
      tone: jobStatusPillTone(job.status),
      ownerRole: jobOwnerRole(job),
      stageSince: job.stageSince,
    };
  });
}

export function customerFilterOptions(session: PortalSession) {
  return [
    { id: "all", label: "All customers" },
    ...customersForSession(session).map((c) => ({ id: c.id, label: c.name })),
  ];
}

export type ShopNavModule = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
};

export function getShopNavModules(session: PortalSession): ShopNavModule[] {
  const inbox = inboxForSession(session);
  if (shopIdForSession(session) === "heaterco") {
    return [
      {
        href: "/inbox",
        eyebrow: "Inbox",
        title: `${inbox.length} to match`,
        body: "Pre-CPQ RFQ intake — confirm customer, then reconcile sources",
      },
      {
        href: "/customers/lakeshore",
        eyebrow: "Jobs / projects",
        title: "Lakeshore new injection mold",
        body: "12 cartridge heaters — conflicts open across email, drawing, spreadsheet",
      },
      {
        href: "/jobs/lakeshore-cartridge-heaters/workflow",
        eyebrow: "Workflows",
        title: "RFQ to confirmed packet",
        body: "Does not replace Infor CPQ, CRM, or ERP",
      },
      {
        href: "/jobs/lakeshore-cartridge-heaters/handoff",
        eyebrow: "Handoff",
        title: "Ready for Infor CPQ (demo)",
        body: "Confirmed packet preview — send button disabled",
      },
    ];
  }

  return [
    {
      href: "/inbox",
      eyebrow: "Inbox",
      title: `${inbox.length} to match`,
      body: "Suggested customer and job matches to confirm",
    },
    {
      href: `/customers/${DEMO_CUSTOMER.id}/projects/${DEMO_PROJECT.id}`,
      eyebrow: "Jobs / projects",
      title: DEMO_PROJECT.name,
      body: "Meridian Line 3: platform + machine guard",
    },
    {
      href: "/workflows",
      eyebrow: "Workflows",
      title: "Steps by job",
      body: "Minimum, ideal, and added steps",
    },
    {
      href: "/documents",
      eyebrow: "Sign-off / documents",
      title: "Draft outputs",
      body: "Sign-off, agreement, BOM, and PDF",
    },
  ];
}

/** @deprecated Use customerFilterOptions(session) */
export const CUSTOMER_FILTER_OPTIONS = [
  { id: "all", label: "All customers" },
  ...DEMO_CUSTOMERS.map((c) => ({ id: c.id, label: c.name })),
];
