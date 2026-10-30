"use client";

import { useState } from "react";
import { PoweredByBloomingRock } from "@/components/portal/PoweredByBloomingRock";
import type { FileRequestRecord } from "@/lib/portal/intake-types";
import { submitCustomerUpload } from "@/lib/portal/intake-store";
import { NORTHRIDGE_BRANDING } from "@/lib/portal/admin-demo-data";

export function CustomerUploadForm({ request }: { request: FileRequestRecord }) {
  const [files, setFiles] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const b = NORTHRIDGE_BRANDING;
  const closed = request.status !== "open";

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const names = [...e.dataTransfer.files].map((f) => f.name);
    if (names.length) setFiles((prev) => [...prev, ...names]);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const names = [...(e.target.files ?? [])].map((f) => f.name);
    if (names.length) setFiles((prev) => [...prev, ...names]);
  };

  const submit = () => {
    if (!files.length || closed) return;
    submitCustomerUpload({ token: request.token, fileNames: files, note });
    setDone(true);
  };

  return (
    <div
      className="customer-upload"
      style={
        {
          "--shop-accent": b.accentColor,
          "--shop-primary": b.primaryColor,
        } as React.CSSProperties
      }
    >
      <header className="customer-upload__header">
        <p className="customer-upload__shop">{b.logoLabel}</p>
        <h1>{request.title}</h1>
        <p className="customer-upload__for">
          For {request.customerName} · {request.projectName}
        </p>
      </header>

      {closed ? (
        <p className="customer-upload__closed" role="alert">
          This upload link is closed — the job ended or the 30-day window after shipping expired.
          Ask the shop for a new link if you need to send more files.
        </p>
      ) : (
        <>
          <section className="customer-upload__ask">
            <h2>What to send</h2>
            <p>{request.askDescription}</p>
            <p className="look-field__hint">
              No login required. Link stays open through quote and order; closes 30 days after ship or
              when the shop closes the job.
            </p>
          </section>

          {done ? (
            <p className="customer-upload__thanks" role="status">
              Thanks — your files were submitted. {request.customerName}&apos;s shop will review them
              shortly.
            </p>
          ) : (
            <>
              <div
                className="customer-upload__drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
              >
                <p>Drag files here</p>
                <label className="btn btn--secondary customer-upload__pick">
                  Choose files
                  <input type="file" multiple hidden onChange={onPick} />
                </label>
              </div>
              {files.length ? (
                <ul className="portal-plain">
                  {files.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              ) : null}
              <label className="look-field">
                <span className="look-field__label">Optional note</span>
                <textarea
                  className="look-field__input"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn btn--primary"
                disabled={!files.length}
                onClick={submit}
              >
                Submit files
              </button>
            </>
          )}
        </>
      )}

      <PoweredByBloomingRock />
    </div>
  );
}
