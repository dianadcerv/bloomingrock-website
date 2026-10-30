import type { DemoSource, InboxItem } from "./demo-data";

export const UPLOAD_LINK_DAYS_AFTER_SHIP = 30;

export type UploadLinkStatus =
  | "open"
  | "closed-job"
  | "closed-shipping-expired"
  | "closed-superseded";

export type FileRequestRecord = {
  token: string;
  jobId: string;
  jobName: string;
  customerName: string;
  projectName: string;
  title: string;
  askDescription: string;
  status: UploadLinkStatus;
  createdAt: string;
  createdBy: string;
  closedAt?: string;
  /** When set, link stays open until 30 days after this timestamp (ms). */
  orderShippedAtMs?: number;
  /** Optional inbox thread this request was sent from */
  inboxItemId?: string;
};

export type CustomerUploadPayload = {
  token: string;
  fileNames: string[];
  note: string;
  submittedAt: string;
};

export type PhoneIntakePayload = {
  id: string;
  callerName: string;
  callerPhone: string;
  customerHint: string;
  projectHint: string;
  summary: string;
  createdAt: string;
  createdBy: string;
};

export type WebsiteQuotePayload = {
  id: string;
  contactName: string;
  contactEmail: string;
  company: string;
  projectDescription: string;
  submittedAt: string;
};

export type IntakeAuditEntry = {
  id: string;
  at: string;
  who: string;
  action: string;
  detail: string;
  jobId?: string;
};

export type StoredJobSource = DemoSource & { jobId: string };

export type InboxItemKind = "email" | "customer-upload" | "website-quote" | "phone-call";

export type ExtendedInboxItem = InboxItem & {
  kind?: InboxItemKind;
  fileRequestToken?: string;
};

export type JobUploadLinkDisplayStatus =
  | "none"
  | "open"
  | "closing-after-ship"
  | "closed-job"
  | "closed-shipping-expired";

export type JobUploadLinkSummary = {
  displayStatus: JobUploadLinkDisplayStatus;
  daysUntilShippingClose: number | null;
  activeRequest: FileRequestRecord | null;
  lastClosedRequest: FileRequestRecord | null;
};
