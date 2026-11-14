"use client";

import { useState, useSyncExternalStore } from "react";
import { OpenQuestion } from "@/components/portal/DemoNotes";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

function useClientOrigin() {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
}

export function AdminIntakeEmbedClient() {
  const [copied, setCopied] = useState(false);
  const origin = useClientOrigin();
  const embedSrc = origin ? `${origin}/intake/quote` : "";

  const snippet = embedSrc
    ? `<iframe src="${embedSrc}" title="Quote request" width="100%" height="520" style="border:1px solid #c4c0b6;border-radius:4px;" loading="lazy"></iframe>`
    : "";

  const copy = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* demo */
    }
  };

  return (
    <>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.secureUploadStorage}</OpenQuestion>
      <section className="portal-section">
        <h2>Embed snippet</h2>
        <p className="look-field__hint">
          Paste on your shop website. Submissions land in Inbox as new quote requests with a
          suggested customer match (demo).
        </p>
        <textarea className="look-field__input portal-embed-snippet" readOnly rows={4} value={snippet} />
        <button type="button" className="btn btn--primary" onClick={copy} disabled={!snippet}>
          {copied ? "Copied" : "Copy snippet"}
        </button>
      </section>
      <section className="portal-section">
        <h2>Preview</h2>
        {embedSrc ? (
          <iframe
            className="portal-embed-preview"
            src={embedSrc}
            title="Quote request form preview"
          />
        ) : (
          <p className="look-field__hint">Loading preview…</p>
        )}
      </section>
    </>
  );
}