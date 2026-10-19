"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ExtractedProvenanceMarker,
  ProvenanceLegend,
} from "@/components/portal/ProvenanceMarkers";
import { Badge } from "@/components/portal/PortalUi";
import { RequestFilesDialog } from "@/components/portal/RequestFilesDialog";
import type { InboxItem } from "@/lib/portal/demo-data";
import { inboxAttachmentPreviewHref } from "@/lib/portal/demo-data";
import { getExtraInboxItems, INTAKE_UPDATED_EVENT } from "@/lib/portal/intake-store";
import type { ExtendedInboxItem } from "@/lib/portal/intake-types";

export function InboxDetailClient({
  itemId,
  seed,
  sessionName,
}: {
  itemId: string;
  seed: InboxItem | null;
  sessionName: string;
}) {
  const [item, setItem] = useState<ExtendedInboxItem | null>(seed);

  useEffect(() => {
    const refresh = () => {
      const extra = getExtraInboxItems().find((i) => i.id === itemId);
      setItem(extra ?? seed);
    };
    refresh();
    window.addEventListener(INTAKE_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(INTAKE_UPDATED_EVENT, refresh);
  }, [itemId, seed]);

  if (!item) {
    return (
      <p>
        Item not found. <Link href="/inbox">Back to inbox</Link>
      </p>
    );
  }

  const dual = item.suggested.jobIds.length > 1;
  const jobId = item.suggested.jobIds[0];

  return (
    <>
      {item.kind === "customer-upload" ? (
        <p className="portal-conflict-banner" role="status">
          <strong>New files from customer</strong> — match suggested from secure upload link (confirm
          to attach to job sources).
        </p>
      ) : null}
      <ProvenanceLegend />
      {item.kind === "email" || !item.kind ? (
        <ExtractedProvenanceMarker label="Extracted from email (Oct 8)" />
      ) : (
        <Badge tone="info">Pulled from {item.kind === "customer-upload" ? "upload link" : item.kind}</Badge>
      )}
      <article className="portal-letter">
        {item.bodyPreview.split("\n").map((line, i) => (
          <p key={i}>{line || "\u00a0"}</p>
        ))}
        {item.attachments.length ? (
          <ul className="portal-plain">
            {item.attachments.map((name) => {
              const preview = inboxAttachmentPreviewHref(item.suggested.jobIds, name);
              return (
                <li key={name}>
                  {preview ? <Link href={preview}>{name}</Link> : <span>{name}</span>}
                </li>
              );
            })}
          </ul>
        ) : null}
      </article>
      <section className="portal-section">
        <h2>Suggested match</h2>
        <p>
          Customer: <strong>{item.suggested.customer}</strong>
          <br />
          Project: <strong>{item.suggested.project}</strong>
          <br />
          Job{dual ? "s" : ""}: <strong>{item.suggested.jobs.join(" · ")}</strong>
        </p>
      </section>
      <div className="portal-inline-actions portal-inbox-actions">
        {jobId ? (
          <RequestFilesDialog
            jobId={jobId}
            jobName={item.suggested.jobs[0] ?? jobId}
            createdBy={sessionName}
            inboxItemId={item.id}
            defaultTitle={`More files — ${item.subject}`}
          />
        ) : null}
        {item.suggested.jobIds.map((jid) => (
          <Link key={jid} className="btn btn--primary" href={`/jobs/${jid}`}>
            Confirm → {jid === "access-platform" ? "Platform" : jid}
          </Link>
        ))}
        <Link className="btn btn--quiet portal-btn-quiet" href="/inbox">
          Reassign match (demo)
        </Link>
      </div>
    </>
  );
}
