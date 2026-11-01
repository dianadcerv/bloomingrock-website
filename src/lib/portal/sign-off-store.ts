import type { AuditEntry } from "./demo-data";
import { getCustomerForJob, getJob } from "./demo-data";

export const SIGN_OFF_STORAGE_KEY = "portal-sign-off-v1";
export const SIGN_OFF_UPDATED_EVENT = "portal-sign-off-updated";

export type SignOffInvite = {
  contact: string;
  email: string;
  code: string;
  sentAt: string;
  sentBy: string;
};

type SignOffState = {
  invites: Record<string, SignOffInvite>;
  audit: AuditEntry[];
};

function emptyState(): SignOffState {
  return { invites: {}, audit: [] };
}

function readState(): SignOffState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = sessionStorage.getItem(SIGN_OFF_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as SignOffState;
    return { ...emptyState(), ...parsed, invites: parsed.invites ?? {}, audit: parsed.audit ?? [] };
  } catch {
    return emptyState();
  }
}

function writeState(state: SignOffState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SIGN_OFF_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(SIGN_OFF_UPDATED_EVENT));
}

function seedInviteForJob(jobId: string): SignOffInvite | null {
  const job = getJob(jobId);
  return job?.signOffInvite ?? null;
}

export function getSignOffInvite(jobId: string): SignOffInvite | null {
  const state = readState();
  return state.invites[jobId] ?? seedInviteForJob(jobId);
}

export function getSignOffAuditForJob(jobId: string): AuditEntry[] {
  const state = readState();
  return state.audit.filter((e) => e.id.startsWith(`${jobId}-`));
}

function formatSentAt() {
  return (
    new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }) + " CT"
  );
}

export function markRequirementsReadyAndSendSignOff(jobId: string, who: string): SignOffInvite | null {
  const job = getJob(jobId);
  if (!job || job.controlledHold) return null;
  if (getSignOffInvite(jobId)) return getSignOffInvite(jobId);

  const customer = getCustomerForJob(job);
  const contact = customer?.contact ?? "Customer contact";
  const email = customer?.email ?? "customer@demo";
  const code = String(Math.floor(100000 + Math.random() * 900000));

  const invite: SignOffInvite = {
    contact,
    email,
    code,
    sentAt: formatSentAt(),
    sentBy: who,
  };

  const auditEntry: AuditEntry = {
    id: `${jobId}-signoff-auto-${Date.now()}`,
    at: invite.sentAt,
    who: "App (automatic)",
    action: "Sign-off code sent",
    detail: `Sign-off code sent automatically to ${contact} (${email}).`,
  };

  const state = readState();
  state.invites[jobId] = invite;
  state.audit.unshift(auditEntry);
  writeState(state);
  return invite;
}

export function signOffPageUrl(jobId: string) {
  return `/jobs/${jobId}/sign-off`;
}
