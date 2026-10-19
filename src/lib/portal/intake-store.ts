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

/** Legacy session rows may lack status (pre–quote-sent rule). */
function normalizeFileRequest(r: FileRequestRecord & { expiryDays?: number }): FileRequestRecord {
  const status: UploadLinkStatus =
    r.status ??
    (r.closedAt ? "closed-quote-sent" : "open");
  const { expiryDays: _drop, ...rest } = r;
  return { ...rest, status };
}

function writeState(state: IntakeState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(INTAKE_UPDATED_EVENT));
}

function nowLabel() {
  return new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT";
}

function randomToken() {
  return `upl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isUploadLinkOpen(req: FileRequestRecord) {
  return req.status === "open";
}

export function getFileRequest(token: string) {
  return readState().fileRequests.find((r) => r.token === token) ?? null;
}

function closeOpenLinksForJob(
  state: IntakeState,
  jobId: string,
  status: UploadLinkStatus,
  who: string,
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
    action: status === "closed-quote-sent" ? "Closed upload link" : "Replaced upload link",
    detail,
    jobId,
  });
}

export function getJobUploadLinkSummary(jobId: string): JobUploadLinkSummary {
  const requests = readState()
    .fileRequests.filter((r) => r.jobId === jobId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const activeRequest = requests.find((r) => r.status === "open") ?? null;
  const lastClosedRequest =
    requests.find((r) => r.status === "closed-quote-sent" || r.status === "closed-superseded") ??
    null;

  if (activeRequest) {
    return { displayStatus: "open", activeRequest, lastClosedRequest };
  }
  if (lastClosedRequest?.status === "closed-quote-sent") {
    return { displayStatus: "closed-quote-sent", activeRequest: null, lastClosedRequest };
  }
  return { displayStatus: "none", activeRequest: null, lastClosedRequest };
}

export function createFileRequest(input: {
  jobId: string;
  title: string;
  askDescription: string;
  createdBy: string;
  inboxItemId?: string;
  /** When true, closes any prior open link on this job (superseded). */
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
      "New upload link issued — previous link closed (demo).",
    );
  }
  state.fileRequests.push(record);
  state.audit.unshift({
    id: `ia-${Date.now()}`,
    at: record.createdAt,
    who: input.createdBy,
    action: "Created secure upload link",
    detail: `${record.title} — open until quote is sent (demo).`,
    jobId: input.jobId,
  });
  writeState(state);
  return record;
}

/** One-click fresh link after quote sent (reuses last request copy). */
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

export function closeUploadLinksForQuoteSent(jobId: string, who: string) {
  const state = readState();
  const hadOpen = state.fileRequests.some((r) => r.jobId === jobId && r.status === "open");
  if (!hadOpen) return false;
  closeOpenLinksForJob(
    state,
    jobId,
    "closed-quote-sent",
    who,
    "Quote sent — customer upload link closed (demo).",
  );
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
  if (!req || !isUploadLinkOpen(req)) return null;

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
