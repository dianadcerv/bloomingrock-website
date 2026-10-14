import type { DemoJob } from "./demo-data";

export const JOB_CONFLICT_RESOLUTIONS_KEY = "portal-job-conflict-resolutions-v1";
export const JOB_CONFLICT_AUDIT_KEY = "portal-job-conflict-audit-v1";
export const JOB_CONFLICT_UPDATED_EVENT = "portal-job-conflicts-updated";

export type ConflictResolution = {
  checklistItemId: string;
  chosenValue: string;
  chosenSourceId: string;
  resolvedAt: string;
  resolvedBy: string;
};

export type ConflictAuditEntry = {
  id: string;
  at: string;
  who: string;
  action: string;
  detail: string;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(JOB_CONFLICT_UPDATED_EVENT));
}

export function getResolutions(jobId: string): ConflictResolution[] {
  const all = readJson<Record<string, ConflictResolution[]>>(JOB_CONFLICT_RESOLUTIONS_KEY) ?? {};
  return all[jobId] ?? [];
}

export function getConflictAudit(jobId: string): ConflictAuditEntry[] {
  const all = readJson<Record<string, ConflictAuditEntry[]>>(JOB_CONFLICT_AUDIT_KEY) ?? {};
  return all[jobId] ?? [];
}

export function sourceShortLabel(sourceId: string) {
  if (sourceId.includes("email")) return "email";
  if (sourceId.includes("sketch")) return "sketch PDF";
  if (sourceId.includes("drawing")) return "drawing PDF";
  if (sourceId.includes("call")) return "call";
  if (sourceId.includes("pdf")) return "PDF";
  return "source";
}

export function unresolvedConflictCount(job: DemoJob, resolutions: ConflictResolution[]) {
  const resolvedIds = new Set(resolutions.map((r) => r.checklistItemId));
  return job.checklist.filter((item) => item.status === "conflict" && !resolvedIds.has(item.id))
    .length;
}

export function resolveConflict(
  jobId: string,
  input: {
    checklistItemId: string;
    fieldLabel: string;
    chosenValue: string;
    chosenSourceId: string;
    who: string;
  },
) {
  const allRes = readJson<Record<string, ConflictResolution[]>>(JOB_CONFLICT_RESOLUTIONS_KEY) ?? {};
  const list = allRes[jobId] ?? [];
  const nextRes: ConflictResolution = {
    checklistItemId: input.checklistItemId,
    chosenValue: input.chosenValue,
    chosenSourceId: input.chosenSourceId,
    resolvedAt: new Date().toISOString(),
    resolvedBy: input.who,
  };
  const filtered = list.filter((r) => r.checklistItemId !== input.checklistItemId);
  allRes[jobId] = [...filtered, nextRes];
  writeJson(JOB_CONFLICT_RESOLUTIONS_KEY, allRes);

  const allAudit = readJson<Record<string, ConflictAuditEntry[]>>(JOB_CONFLICT_AUDIT_KEY) ?? {};
  const audit = allAudit[jobId] ?? [];
  const entry: ConflictAuditEntry = {
    id: `ca-${Date.now()}`,
    at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
    who: input.who,
    action: "Resolved conflict",
    detail: `${input.fieldLabel}: chose ${input.chosenValue} (${sourceShortLabel(input.chosenSourceId)}) — person picked; not auto-chosen.`,
  };
  allAudit[jobId] = [entry, ...audit];
  writeJson(JOB_CONFLICT_AUDIT_KEY, allAudit);
}
