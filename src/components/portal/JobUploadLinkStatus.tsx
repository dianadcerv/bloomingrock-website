"use client";

import { useEffect, useState } from "react";
import { OpenQuestion } from "@/components/portal/DemoNotes";
import { Badge } from "@/components/portal/PortalUi";
import { RequestFilesDialog } from "@/components/portal/RequestFilesDialog";
import {
  closeJobUploadLinks,
  getJobUploadLinkSummary,
  INTAKE_UPDATED_EVENT,
  markOrderShippedForUploadLinks,
  sendNewUploadLink,
  uploadLinkHref,
} from "@/lib/portal/intake-store";
import type { JobUploadLinkSummary } from "@/lib/portal/intake-types";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

function badgeForSummary(summary: JobUploadLinkSummary) {
  switch (summary.displayStatus) {
    case "open":
      return { tone: "success" as const, label: "Open" };
    case "closing-after-ship":
      return {
        tone: "info" as const,
        label: `Closes in ${summary.daysUntilShippingClose ?? 0} days (order shipped)`,
      };
    case "closed-job":
      return { tone: "neutral" as const, label: "Closed — job closed" };
    case "closed-shipping-expired":
      return { tone: "neutral" as const, label: "Closed — 30 days after shipping" };
    default:
      return null;
  }
}

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
      ? {
          displayStatus: "none",
          daysUntilShippingClose: null,
          activeRequest: null,
          lastClosedRequest: null,
        }
      : getJobUploadLinkSummary(jobId),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const refresh = () => setSummary(getJobUploadLinkSummary(jobId));
    refresh();
    window.addEventListener(INTAKE_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(INTAKE_UPDATED_EVENT, refresh);
  }, [jobId]);

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

  const badge = badgeForSummary(summary);
  const linkActive =
    summary.displayStatus === "open" || summary.displayStatus === "closing-after-ship";
  const linkClosed =
    summary.displayStatus === "closed-job" ||
    summary.displayStatus === "closed-shipping-expired" ||
    summary.displayStatus === "none";

  return (
    <section className="portal-section portal-upload-link-status">
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.uploadLinkLifetimePolicy}</OpenQuestion>
      <div className="portal-dashboard__section-head">
        <h2>Customer upload link</h2>
        {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
      </div>
      <p className="look-field__hint">
        Stays open through quote and order. Closes automatically 30 days after the order ships, or
        when you close the job (demo).
      </p>

      {linkActive && summary.activeRequest ? (
        <p className="look-field__hint">
          Active request: <strong>{summary.activeRequest.title}</strong>
        </p>
      ) : null}

      <div className="portal-inline-actions">
        <RequestFilesDialog jobId={jobId} jobName={jobName} createdBy={createdBy} />
        {linkClosed ? (
          <button type="button" className="btn btn--primary" onClick={sendNewLink}>
            {copied ? "Link copied" : "Send new upload link"}
          </button>
        ) : null}
        {linkActive ? (
          <>
            <button
              type="button"
              className="btn btn--quiet portal-btn-quiet"
              onClick={() => markOrderShippedForUploadLinks(jobId, createdBy)}
            >
              Mark order shipped (demo)
            </button>
            <button
              type="button"
              className="btn btn--quiet portal-btn-quiet"
              onClick={() => closeJobUploadLinks(jobId, createdBy)}
            >
              Close job
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
