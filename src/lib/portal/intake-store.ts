import type { DemoSource } from "./demo-data";
import { DEMO_CUSTOMER, DEMO_PROJECT, getCustomerForJob, getProjectForJob, getJob } from "./demo-data";
import type {
  CustomerUploadPayload,
  ExtendedInboxItem,
  FileRequestRecord,
  IntakeAuditEntry,
  JobUploadLinkSummary,
  PhoneIntakePayload,
  StoredJobSource,
  UploadLinkStatus,
  WebsiteQuotePayload,
} from "./intake-types";
import { UPLOAD_LINK_DAYS_AFTER_SHIP } from "./intake-types";

export const INTAKE_STORAGE_KEY = "portal-intake-v1";
export const INTAKE_UPDATED_EVENT = "portal-intake-updated";

type IntakeState = {
  fileRequests: FileRequestRecord[];
  uploads: CustomerUploadPayload[];
  extraInbox: ExtendedInboxItem[];
  extraSources: StoredJobSource[];
  audit: IntakeAuditEntry[];
  phoneIntakes: PhoneIntakePayload[];
  websiteQuotes: WebsiteQuotePayload[];
};

function emptyState(): IntakeState {
  return {
    fileRequests: [],
    uploads: [],
    extraInbox: [],
    extraSources: [],
    audit: [],
    phoneIntakes: [],
    websiteQuotes: [],
  };
}

function shippingCloseDeadlineMs(req: FileRequestRecord) {
  if (!req.orderShippedAtMs) return null;
  return req.orderShippedAtMs + UPLOAD_LINK_DAYS_AFTER_SHIP * 86_400_000;
}

export function daysUntilShippingClose(req: FileRequestRecord): number | null {
  const deadline = shippingCloseDeadlineMs(req);
  if (!deadline) return null;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 86_400_000));
}

function normalizeFileRequest(
  r: FileRequestRecord & { expiryDays?: number; status?: string },
): FileRequestRecord {
  let status: UploadLinkStatus = r.status ?? "open";
  if ((r.status as string | undefined) === "closed-quote-sent") status = "closed-job";
  const rest = { ...r, status };
  delete (rest as { expiryDays?: number }).expiryDays;
  return rest;
}

function readState(): IntakeState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = sessionStorage.getItem(INTAKE_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as IntakeState;
    return {
      ...emptyState(),
      ...parsed,
      fileRequests: (parsed.fileRequests ?? []).map(normalizeFileRequest),
    };
  } catch {
    return emptyState();
  }
}

function writeState(state: IntakeState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(INTAKE_UPDATED_EVENT));
}

/** Auto-close open links 30 days after order shipped (demo). */
export function applyShippingAutoClose(persist = true) {
  const state = readState();
  const at = nowLabel();
  let changed = false;
  for (const req of state.fileRequests) {
    if (req.status !== "open" || !req.orderShippedAtMs) continue;
    const deadline = shippingCloseDeadlineMs(req);
    if (deadline && Date.now() >= deadline) {
      req.status = "closed-shipping-expired";
      req.closedAt = at;
      changed = true;
      state.audit.unshift({
        id: `ia-${Date.now()}-ship-exp`,
        at,
        who: "App (demo)",
        action: "Closed upload link",
        detail: `30 days after order shipped — link closed automatically (demo).`,
        jobId: req.jobId,
      });
    }
  }
  if (changed && persist) writeState(state);
  return state;
}

function nowLabel() {
  return new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT";
}

function randomToken() {
  return `upl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isUploadLinkOpen(req: FileRequestRecord) {
  applyShippingAutoClose(true);
  const fresh = getFileRequest(req.token);
  return fresh?.status === "open";
}

export function getFileRequest(token: string) {
  applyShippingAutoClose(true);
  return readState().fileRequests.find((r) => r.token === token) ?? null;
}

function closeOpenLinksForJob(
  state: IntakeState,
  jobId: string,
  status: UploadLinkStatus,
  who: string,
  action: string,
  detail: string,
) {
  const at = nowLabel();
  for (const req of state.fileRequests) {
    if (req.jobId === jobId && req.status === "open") {
      req.status = status;
      req.closedAt = at;
    }
  }
  state.audit.unshift({
    id: `ia-${Date.now()}-close`,
    at,
    who,
    action,
    detail,
    jobId,
  });
}

export function getJobUploadLinkSummary(jobId: string): JobUploadLinkSummary {
  const state = applyShippingAutoClose(true);
  const requests = state.fileRequests
    .filter((r) => r.jobId === jobId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const activeRequest = requests.find((r) => r.status === "open") ?? null;
  const lastClosedRequest =
    requests.find(
      (r) =>
        r.status === "closed-job" ||
        r.status === "closed-shipping-expired" ||
        r.status === "closed-superseded",
    ) ?? null;

  if (activeRequest) {
    if (activeRequest.orderShippedAtMs) {
      const days = daysUntilShippingClose(activeRequest);
      return {
        displayStatus: "closing-after-ship",
        daysUntilShippingClose: days,
        activeRequest,
        lastClosedRequest,
      };
    }
    return {
      displayStatus: "open",
      daysUntilShippingClose: null,
      activeRequest,
      lastClosedRequest,
    };
  }

  if (lastClosedRequest?.status === "closed-job") {
    return {
      displayStatus: "closed-job",
      daysUntilShippingClose: null,
      activeRequest: null,
      lastClosedRequest,
    };
  }
  if (lastClosedRequest?.status === "closed-shipping-expired") {
    return {
      displayStatus: "closed-shipping-expired",
      daysUntilShippingClose: null,
      activeRequest: null,
      lastClosedRequest,
    };
  }

  return {
    displayStatus: "none",
    daysUntilShippingClose: null,
    activeRequest: null,
    lastClosedRequest,
  };
}

export function createFileRequest(input: {
  jobId: string;
  title: string;
  askDescription: string;
  createdBy: string;
  inboxItemId?: string;
  replaceOpen?: boolean;
}): FileRequestRecord {
  const job = getJob(input.jobId);
  const customer = job ? getCustomerForJob(job) : null;
  const project = job ? getProjectForJob(job) : null;
  const token = randomToken();
  const record: FileRequestRecord = {
    token,
    jobId: input.jobId,
    jobName: job?.name ?? input.jobId,
    customerName: customer?.name ?? "Customer",
    projectName: project?.name ?? "Project",
    title: input.title.trim(),
    askDescription: input.askDescription.trim(),
    status: "open",
    createdAt: nowLabel(),
    createdBy: input.createdBy,
    inboxItemId: input.inboxItemId,
  };
  const state = readState();
  if (input.replaceOpen !== false) {
    closeOpenLinksForJob(
      state,
      input.jobId,
      "closed-superseded",
      input.createdBy,
      "Replaced upload link",
      "New upload link issued — previous link closed (demo).",
    );
  }
  state.fileRequests.push(record);
  state.audit.unshift({
    id: `ia-${Date.now()}`,
    at: record.createdAt,
    who: input.createdBy,
    action: "Created secure upload link",
    detail: `${record.title} — open through quote and order; closes 30 days after ship or when job is closed (demo).`,
    jobId: input.jobId,
  });
  writeState(state);
  return record;
}

export function sendNewUploadLink(jobId: string, createdBy: string) {
  const state = readState();
  const prior = state.fileRequests
    .filter((r) => r.jobId === jobId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  return createFileRequest({
    jobId,
    title: prior?.title ?? `Files for ${getJob(jobId)?.name ?? "job"}`,
    askDescription:
      prior?.askDescription ??
      "Please upload any updated drawings or photos we need for this job.",
    createdBy,
    replaceOpen: true,
  });
}

export function markOrderShippedForUploadLinks(jobId: string, who: string) {
  const state = readState();
  const open = state.fileRequests.filter((r) => r.jobId === jobId && r.status === "open");
  if (!open.length) return false;
  const at = nowLabel();
  const shippedMs = Date.now();
  for (const req of open) {
    if (!req.orderShippedAtMs) req.orderShippedAtMs = shippedMs;
  }
  state.audit.unshift({
    id: `ia-${Date.now()}-ship`,
    at,
    who,
    action: "Marked order shipped",
    detail: `Upload link stays open ${UPLOAD_LINK_DAYS_AFTER_SHIP} days after ship, then closes automatically (demo).`,
    jobId,
  });
  writeState(state);
  return true;
}

export function closeJobUploadLinks(jobId: string, who: string) {
  const state = readState();
  const hadOpen = state.fileRequests.some((r) => r.jobId === jobId && r.status === "open");
  if (!hadOpen) return false;
  closeOpenLinksForJob(
    state,
    jobId,
    "closed-job",
    who,
    "Closed job",
    "Job closed — customer upload link closed (demo).",
  );
  writeState(state);
  return true;
}

/** Demo/screenshots: simulate ship date N days ago for countdown. */
export function demoSetOrderShippedDaysAgo(jobId: string, daysAgo: number, who: string) {
  const state = readState();
  const open = state.fileRequests.find((r) => r.jobId === jobId && r.status === "open");
  if (!open) return false;
  open.orderShippedAtMs = Date.now() - daysAgo * 86_400_000;
  state.audit.unshift({
    id: `ia-${Date.now()}-ship-demo`,
    at: nowLabel(),
    who,
    action: "Marked order shipped",
    detail: `Demo: treated as shipped ${daysAgo} day(s) ago for countdown preview.`,
    jobId,
  });
  writeState(state);
  return true;
}

export function uploadLinkHref(token: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/upload/${token}`;
  }
  return `/upload/${token}`;
}

export function submitCustomerUpload(input: {
  token: string;
  fileNames: string[];
  note: string;
}) {
  const req = getFileRequest(input.token);
  if (!req || req.status !== "open") return null;

  const payload: CustomerUploadPayload = {
    token: input.token,
    fileNames: input.fileNames,
    note: input.note.trim(),
    submittedAt: nowLabel(),
  };

  const state = readState();
  state.uploads.push(payload);

  const job = getJob(req.jobId);
  const customer = job ? getCustomerForJob(job) : null;

  const inboxId = `in-upload-${Date.now().toString(36)}`;
  const item: ExtendedInboxItem = {
    id: inboxId,
    kind: "customer-upload",
    fileRequestToken: input.token,
    subject: "New files from customer",
    from: `${req.customerName} (secure upload link)`,
    suggested: {
      customer: req.customerName,
      customerId: customer?.id ?? DEMO_CUSTOMER.id,
      projectId: job?.projectId ?? DEMO_PROJECT.id,
      project: req.projectName,
      jobIds: [req.jobId],
      jobs: [req.jobName],
    },
    snippet: input.fileNames.join(", ") || "Files uploaded",
    bodyPreview: input.note
      ? `Customer note:\n${input.note}\n\nFiles: ${input.fileNames.join(", ")}`
      : `Files uploaded via secure link for “${req.title}”:\n${input.fileNames.join("\n")}`,
    attachments: input.fileNames,
  };
  state.extraInbox.unshift(item);

  for (const name of input.fileNames) {
    const source: StoredJobSource = {
      jobId: req.jobId,
      id: `src-upload-${Date.now()}-${name.slice(0, 12)}`,
      kind: name.endsWith(".pdf") ? "pdf" : name.match(/\.(png|jpg|jpeg)$/i) ? "sketch" : "note",
      title: name,
      from: req.customerName,
      summary: `Uploaded via secure link (${req.title}).${input.note ? ` Note: ${input.note}` : ""}`,
      status: "needs-review",
      readByApp: true,
    };
    state.extraSources.push(source);
  }

  state.audit.unshift({
    id: `ia-${Date.now()}-up`,
    at: payload.submittedAt,
    who: "Customer (upload link)",
    action: "Uploaded files",
    detail: `${input.fileNames.join(", ")} → ${req.jobName}. Match suggested from link (demo).`,
    jobId: req.jobId,
  });

  writeState(state);
  return { inboxId, jobId: req.jobId };
}

export function submitWebsiteQuote(input: Omit<WebsiteQuotePayload, "id" | "submittedAt">) {
  const state = readState();
  const record: WebsiteQuotePayload = {
    ...input,
    id: `wq-${Date.now().toString(36)}`,
    submittedAt: nowLabel(),
  };
  state.websiteQuotes.push(record);

  const inboxId = `in-web-${Date.now().toString(36)}`;
  state.extraInbox.unshift({
    id: inboxId,
    kind: "website-quote",
    subject: `Website quote request — ${input.company || input.contactName}`,
    from: `${input.contactName} · ${input.contactEmail}`,
    suggested: {
      customer: input.company || "New lead (suggested match)",
      customerId: DEMO_CUSTOMER.id,
      project: "New project (review match)",
      projectId: DEMO_PROJECT.id,
      jobIds: [],
      jobs: ["— assign job after confirm"],
    },
    snippet: input.projectDescription.slice(0, 120),
    bodyPreview: input.projectDescription,
    attachments: [],
  });

  state.audit.unshift({
    id: `ia-${Date.now()}-web`,
    at: record.submittedAt,
    who: "Website form",
    action: "New quote request",
    detail: `${input.contactName} — suggested customer match (demo).`,
  });

  writeState(state);
  return inboxId;
}

export function submitPhoneIntake(input: Omit<PhoneIntakePayload, "id" | "createdAt">) {
  const state = readState();
  const record: PhoneIntakePayload = {
    ...input,
    id: `ph-${Date.now().toString(36)}`,
    createdAt: nowLabel(),
  };
  state.phoneIntakes.push(record);

  const inboxId = `in-phone-${Date.now().toString(36)}`;
  state.extraInbox.unshift({
    id: inboxId,
    kind: "phone-call",
    subject: `Phone intake — ${input.callerName}`,
    from: `${input.callerName} · ${input.callerPhone}`,
    suggested: {
      customer: input.customerHint || "Review customer match",
      customerId: DEMO_CUSTOMER.id,
      project: input.projectHint || "New project",
      projectId: DEMO_PROJECT.id,
      jobIds: [],
      jobs: ["— create or match job"],
    },
    snippet: input.summary.slice(0, 120),
    bodyPreview: input.summary,
    attachments: [],
  });

  state.audit.unshift({
    id: `ia-${Date.now()}-ph`,
    at: record.createdAt,
    who: input.createdBy,
    action: "Logged phone intake",
    detail: `${input.callerName} — inbox item created (demo).`,
  });

  writeState(state);
  return inboxId;
}

export function getExtraInboxItems(): ExtendedInboxItem[] {
  return readState().extraInbox;
}

export function getExtraSourcesForJob(jobId: string): DemoSource[] {
  return readState().extraSources.filter((s) => s.jobId === jobId);
}

export function getIntakeAuditForJob(jobId: string): IntakeAuditEntry[] {
  return readState().audit.filter((a) => a.jobId === jobId);
}

export function getAllIntakeAudit(): IntakeAuditEntry[] {
  return readState().audit;
}
