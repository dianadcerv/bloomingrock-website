import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExtractedProvenanceMarker,
  ProvenanceLegend,
} from "@/components/portal/ProvenanceMarkers";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { getInboxItem, inboxAttachmentPreviewHref } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Inbox message" };

export default async function InboxDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const session = await requireRole("shop");
  const { itemId } = await params;
  const item = getInboxItem(itemId);
  if (!item) notFound();

  const dual = item.suggested.jobIds.length > 1;

  return (
    <PortalShell session={session} current="/inbox">
      <PageIntro eyebrow="Inbox" title={item.subject}>
        <p>{item.from}</p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.ocrTool}</OpenQuestion>
      <ProvenanceLegend />
      <ExtractedProvenanceMarker label="Extracted from email (Oct 8)" />
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
                  {preview ? (
                    <Link href={preview}>{name}</Link>
                  ) : (
                    <span>{name}</span>
                  )}
                  <span className="look-field__hint"> — demo OCR after confirm</span>
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
          Job{dual ? "s" : ""}:{" "}
          <strong>{item.suggested.jobs.join(" · ")}</strong>
        </p>
        {dual ? (
          <p className="look-field__hint">
            One message can attach in full to more than one job (W1.2). Confirm attaches to
            all listed jobs.
          </p>
        ) : null}
      </section>
      <div className="portal-list__actions">
        <StatusPill tone="draft">Needs confirm</StatusPill>
        {item.suggested.jobIds.map((jobId) => (
          <Link key={jobId} className="btn btn--primary" href={`/jobs/${jobId}`}>
            Confirm → {jobId === "access-platform" ? "Platform" : "Guard"}
          </Link>
        ))}
        <Link className="btn btn--quiet portal-btn-quiet" href="/inbox">
          Reassign match (demo)
        </Link>
        <Link className="btn btn--quiet portal-btn-quiet" href="/inbox">
          Forward to teammate (demo)
        </Link>
      </div>
      <p>
        <Link href="/inbox">← Back to inbox</Link>
      </p>
    </PortalShell>
  );
}
