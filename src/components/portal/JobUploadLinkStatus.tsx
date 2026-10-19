"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/portal/PortalUi";
import { RequestFilesDialog } from "@/components/portal/RequestFilesDialog";
import {
  closeUploadLinksForQuoteSent,
  getJobUploadLinkSummary,
  INTAKE_UPDATED_EVENT,
  sendNewUploadLink,
  uploadLinkHref,
} from "@/lib/portal/intake-store";
import type { JobUploadLinkSummary } from "@/lib/portal/intake-types";

export function JobUploadLinkStatus({
  jobId,
  jobName,
  createdBy,
}: {
  jobId: string;
  jobName: string;
  createdBy: string;
}) {
  const [summary, setSummary] = useState<JobUploadLinkSummary>(() =>
    typeof window === "undefined"
      ? { displayStatus: "none", activeRequest: null, lastClosedRequest: null }
      : getJobUploadLinkSummary(jobId),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const refresh = () => setSummary(getJobUploadLinkSummary(jobId));
    refresh();
    window.addEventListener(INTAKE_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(INTAKE_UPDATED_EVENT, refresh);
  }, [jobId]);

  const markQuoteSent = () => {
    closeUploadLinksForQuoteSent(jobId, createdBy);
  };

  const sendNewLink = async () => {
    const record = sendNewUploadLink(jobId, createdBy);
    const href = uploadLinkHref(record.token);
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* demo */
    }
  };

  const statusLabel =
    summary.displayStatus === "open"
      ? "Open"
      : summary.displayStatus === "closed-quote-sent"
        ? "Closed — quote sent"
        : null;

  const statusTone =
    summary.displayStatus === "open"
      ? ("success" as const)
      : summary.displayStatus === "closed-quote-sent"
        ? ("neutral" as const)
        : ("neutral" as const);

  return (
    <section className="portal-section portal-upload-link-status">
      <div className="portal-dashboard__section-head">
        <h2>Customer upload link</h2>
        {statusLabel ? <Badge tone={statusTone}>{statusLabel}</Badge> : null}
      </div>
      <p className="look-field__hint">
        Link stays open until you send the quote, then closes automatically (demo). No calendar
        expiry.
      </p>

      {summary.displayStatus === "open" && summary.activeRequest ? (
        <p className="look-field__hint">
          Active request: <strong>{summary.activeRequest.title}</strong>
        </p>
      ) : null}

      {summary.displayStatus === "closed-quote-sent" ? (
        <p className="look-field__hint">
          Upload link closed when quote went out
          {summary.lastClosedRequest?.closedAt
            ? ` (${summary.lastClosedRequest.closedAt})`
            : ""}
          .
        </p>
      ) : null}

      <div className="portal-inline-actions">
        <RequestFilesDialog jobId={jobId} jobName={jobName} createdBy={createdBy} />
        {summary.displayStatus === "closed-quote-sent" ? (
          <button type="button" className="btn btn--primary" onClick={sendNewLink}>
            {copied ? "Link copied" : "Send new upload link"}
          </button>
        ) : null}
        {summary.displayStatus === "open" ? (
          <button type="button" className="btn btn--quiet portal-btn-quiet" onClick={markQuoteSent}>
            Mark quote sent (demo)
          </button>
        ) : null}
      </div>
    </section>
  );
}
