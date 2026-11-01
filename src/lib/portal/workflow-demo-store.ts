import type { AuditEntry, WorkflowStep } from "./demo-data";
import type {
  WorkflowChangeProposal,
  WorkflowStepComment,
} from "./workflow-changes";
import {
  WORKFLOW_CHANGE_PROPOSALS,
  WORKFLOW_STEP_COMMENT_SEEDS,
  buildNotificationsFromProposals,
  notificationRecipientsForChange,
  pendingApproverEmail,
} from "./workflow-changes";
import { normalizeEmail } from "./session";

export const WORKFLOW_PROPOSALS_STORAGE_KEY = "portal-wf-proposals-v1";
export const WORKFLOW_STEP_COMMENTS_STORAGE_KEY = "portal-wf-step-comments-v1";
export const WORKFLOW_AUDIT_STORAGE_KEY = "portal-wf-audit-v1";
export const CATEGORY_ACCEPTED_STORAGE_KEY = "portal-cat-suggestions-accepted-v1";

export const WORKFLOW_DEMO_UPDATED_EVENT = "portal-wf-demo-updated";

export type WorkflowDisplayItem =
  | {
      type: "step";
      step: WorkflowStep;
      pendingRemoval?: boolean;
      proposalId?: string;
    }
  | {
      type: "pending-add";
      proposal: WorkflowChangeProposal;
    };

export function mergeKnowledgeSteps(jobId: string, base: WorkflowStep[]): WorkflowStep[] {
  if (typeof window === "undefined") return base;
  try {
    const raw = sessionStorage.getItem(`demo-knowledge-steps-${jobId}`);
    if (!raw) return base;
    const extra = JSON.parse(raw) as WorkflowStep[];
    const ids = new Set(base.map((s) => s.id));
    return [...base, ...extra.filter((s) => !ids.has(s.id))];
  } catch {
    return base;
  }
}

export function readStoredProposals(): WorkflowChangeProposal[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(WORKFLOW_PROPOSALS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WorkflowChangeProposal[];
  } catch {
    return null;
  }
}

export function writeStoredProposals(proposals: WorkflowChangeProposal[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(WORKFLOW_PROPOSALS_STORAGE_KEY, JSON.stringify(proposals));
  window.dispatchEvent(new Event(WORKFLOW_DEMO_UPDATED_EVENT));
}

export function getMergedProposals(): WorkflowChangeProposal[] {
  return readStoredProposals() ?? WORKFLOW_CHANGE_PROPOSALS;
}

export function proposalsForJobMerged(jobId: string): WorkflowChangeProposal[] {
  return getMergedProposals().filter((p) => p.jobId === jobId);
}

export function readStepComments(jobId: string): Record<string, WorkflowStepComment[]> {
  if (typeof window === "undefined") return WORKFLOW_STEP_COMMENT_SEEDS[jobId] ?? {};
  try {
    const raw = sessionStorage.getItem(WORKFLOW_STEP_COMMENTS_STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, Record<string, WorkflowStepComment[]>>) : {};
    const merged = { ...(WORKFLOW_STEP_COMMENT_SEEDS[jobId] ?? {}), ...(all[jobId] ?? {}) };
    return merged;
  } catch {
    return WORKFLOW_STEP_COMMENT_SEEDS[jobId] ?? {};
  }
}

export function writeStepComments(
  jobId: string,
  comments: Record<string, WorkflowStepComment[]>,
) {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(WORKFLOW_STEP_COMMENTS_STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, Record<string, WorkflowStepComment[]>>) : {};
    all[jobId] = comments;
    sessionStorage.setItem(WORKFLOW_STEP_COMMENTS_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(WORKFLOW_DEMO_UPDATED_EVENT));
  } catch {
    /* demo */
  }
}

export function appendAuditEntry(jobId: string, entry: AuditEntry) {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(WORKFLOW_AUDIT_STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, AuditEntry[]>) : {};
    all[jobId] = [entry, ...(all[jobId] ?? [])];
    sessionStorage.setItem(WORKFLOW_AUDIT_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(WORKFLOW_DEMO_UPDATED_EVENT));
  } catch {
    /* demo */
  }
}

export function applyProposalsToSteps(
  jobId: string,
  baseSteps: WorkflowStep[],
  proposals: WorkflowChangeProposal[],
): WorkflowDisplayItem[] {
  const jobProposals = proposals.filter((p) => p.jobId === jobId);
  let steps = baseSteps.map((s) => ({ ...s }));

  for (const p of jobProposals) {
    if (p.status !== "approved" || p.kind !== "remove-step" || !p.targetStepId) continue;
    steps = steps.filter((s) => s.id !== p.targetStepId);
  }
  for (const p of jobProposals) {
    if (p.status !== "approved" || p.kind !== "add-step") continue;
    const id = p.stepId ?? `approved-${p.id}`;
    if (steps.some((s) => s.id === id)) continue;
    steps.push({
      id,
      label: p.stepLabel,
      kind: "added",
      done: false,
      ownerRole: p.proposerSide === "customer" ? "Customer" : "Estimator",
      notes: "Added after mutual approval (demo).",
    });
  }

  const items: WorkflowDisplayItem[] = [];
  for (const step of steps) {
    const pendingRemove = jobProposals.find(
      (p) =>
        p.status === "pending" &&
        p.kind === "remove-step" &&
        p.targetStepId === step.id,
    );
    items.push({
      type: "step",
      step,
      pendingRemoval: Boolean(pendingRemove),
      proposalId: pendingRemove?.id,
    });
  }
  for (const p of jobProposals.filter((p) => p.status === "pending" && p.kind === "add-step")) {
    items.push({ type: "pending-add", proposal: p });
  }
  return items;
}

export function createProposalId() {
  return `wf-ch-${Date.now()}`;
}

export function proposerApprovals(side: "shop" | "customer") {
  return side === "shop"
    ? { shopApproved: true, customerApproved: false }
    : { shopApproved: false, customerApproved: true };
}

export function notificationsForEmail(email: string, proposals?: WorkflowChangeProposal[]) {
  const list = buildNotificationsFromProposals(proposals ?? getMergedProposals());
  const normalized = normalizeEmail(email);
  return list.filter((n) => n.recipientEmails.some((r) => normalizeEmail(r) === normalized));
}

export function workflowAttentionForEmail(
  email: string,
  proposals?: WorkflowChangeProposal[],
): {
  id: string;
  title: string;
  detail: string;
  href: string;
  statusLabel: string;
}[] {
  const normalized = normalizeEmail(email);
  const rows: {
    id: string;
    title: string;
    detail: string;
    href: string;
    statusLabel: string;
    urgency: number;
  }[] = [];
  for (const change of proposals ?? getMergedProposals()) {
    const recipients = notificationRecipientsForChange(change);
    if (!recipients.some((r) => normalizeEmail(r) === normalized)) continue;
    if (change.status === "pending") {
      const approver = pendingApproverEmail(change);
      if (approver && normalizeEmail(approver) === normalized) {
        rows.push({
          id: `wf-approve-${change.id}`,
          urgency: 0,
          title: "Approve workflow change",
          detail:
            change.kind === "add-step"
              ? `Add step: ${change.stepLabel}`
              : `Remove step: ${change.targetStepLabel ?? "step"}`,
          statusLabel: change.isNew ? "NEW · pending" : "Pending approval",
          href: `/jobs/${change.jobId}/workflow#change-${change.id}`,
        });
      }
    } else if (change.status === "rejected-in-discussion") {
      rows.push({
        id: `wf-discuss-${change.id}`,
        urgency: 1,
        title: "Rejected, in discussion",
        detail: change.stepLabel || change.targetStepLabel || "Workflow change thread",
        statusLabel: "Reply needed",
        href: `/jobs/${change.jobId}/workflow#change-${change.id}`,
      });
    }
  }
  return rows.sort((a, b) => a.urgency - b.urgency);
}

export function readAcceptedCategorySuggestions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CATEGORY_ACCEPTED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function acceptCategorySuggestion(id: string) {
  if (typeof window === "undefined") return;
  const current = new Set(readAcceptedCategorySuggestions());
  current.add(id);
  sessionStorage.setItem(CATEGORY_ACCEPTED_STORAGE_KEY, JSON.stringify([...current]));
  window.dispatchEvent(new Event(WORKFLOW_DEMO_UPDATED_EVENT));
}
