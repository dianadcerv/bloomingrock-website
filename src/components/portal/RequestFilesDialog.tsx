"use client";

import { useRef, useState } from "react";
import { OpenQuestion } from "@/components/portal/DemoNotes";
import { createFileRequest, uploadLinkHref } from "@/lib/portal/intake-store";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export function RequestFilesDialog({
  jobId,
  jobName,
  createdBy,
  defaultTitle,
  defaultAsk,
  inboxItemId,
}: {
  jobId: string;
  jobName: string;
  createdBy: string;
  defaultTitle?: string;
  defaultAsk?: string;
  inboxItemId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle ?? `Files for ${jobName}`);
  const [ask, setAsk] = useState(
    defaultAsk ?? "Please upload drawings, photos, or specs we asked for on this job.",
  );
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    setGeneratedLink(null);
    setOpen(true);
    dialogRef.current?.showModal();
  };

  const generate = () => {
    const record = createFileRequest({
      jobId,
      title,
      askDescription: ask,
      createdBy,
      inboxItemId,
    });
    setGeneratedLink(uploadLinkHref(record.token));
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
    } catch {
      /* demo */
    }
  };

  return (
    <>
      <button type="button" className="btn btn--secondary" onClick={openDialog}>
        Request files
      </button>

      <dialog ref={dialogRef} className="portal-dialog" open={open} onClose={() => setOpen(false)}>
        <form method="dialog" className="portal-dialog__inner" onSubmit={(e) => e.preventDefault()}>
          <h2>Request files (secure link)</h2>
          <p className="look-field__hint">
            Customer gets a branded upload page — no account. Link stays open through quote and
            order; closes 30 days after ship or when the job is closed (demo: session only).
          </p>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.secureUploadVirusScan}</OpenQuestion>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.secureUploadStorage}</OpenQuestion>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.secureUploadRevocation}</OpenQuestion>

          <label className="look-field">
            <span className="look-field__label">Request name</span>
            <input
              className="look-field__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="look-field">
            <span className="look-field__label">What you&apos;re asking for</span>
            <textarea
              className="look-field__input"
              rows={3}
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
            />
          </label>

          {generatedLink ? (
            <div className="portal-upload-link-result">
              <p className="look-field__label">Copy and send to customer</p>
              <input className="look-field__input" readOnly value={generatedLink} />
              <div className="portal-inline-actions">
                <button type="button" className="btn btn--primary" onClick={copyLink}>
                  Copy link
                </button>
                <a
                  className="btn btn--quiet portal-btn-quiet"
                  href={generatedLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview upload page
                </a>
              </div>
              <p className="look-field__hint">Status: Open (through quote and order).</p>
            </div>
          ) : (
            <button type="button" className="btn btn--primary" onClick={generate}>
              Generate link
            </button>
          )}

          <button
            type="button"
            className="btn btn--quiet portal-btn-quiet portal-dialog__close"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}
