"use client";

import Link from "next/link";
import { useState } from "react";
import { submitPhoneIntake } from "@/lib/portal/intake-store";

export function PhoneIntakeForm({ createdBy }: { createdBy: string }) {
  const [callerName, setCallerName] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [customerHint, setCustomerHint] = useState("");
  const [projectHint, setProjectHint] = useState("");
  const [summary, setSummary] = useState("");
  const [inboxId, setInboxId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = submitPhoneIntake({
      callerName: callerName.trim(),
      callerPhone: callerPhone.trim(),
      customerHint: customerHint.trim(),
      projectHint: projectHint.trim(),
      summary: summary.trim(),
      createdBy,
    });
    setInboxId(id);
  };

  if (inboxId) {
    return (
      <p className="portal-draft" role="status">
        Saved to inbox.{" "}
        <Link className="btn btn--primary" href={`/inbox/${inboxId}`}>
          Review intake
        </Link>
      </p>
    );
  }

  return (
    <form className="portal-form portal-phone-intake" onSubmit={submit}>
      <label className="look-field">
        <span className="look-field__label">Caller name</span>
        <input className="look-field__input" value={callerName} onChange={(e) => setCallerName(e.target.value)} required />
      </label>
      <label className="look-field">
        <span className="look-field__label">Phone</span>
        <input className="look-field__input" value={callerPhone} onChange={(e) => setCallerPhone(e.target.value)} required />
      </label>
      <label className="look-field">
        <span className="look-field__label">Customer (who they are)</span>
        <input className="look-field__input" value={customerHint} onChange={(e) => setCustomerHint(e.target.value)} placeholder="e.g. Meridian Food Plants" />
      </label>
      <label className="look-field">
        <span className="look-field__label">Project / site</span>
        <input className="look-field__input" value={projectHint} onChange={(e) => setProjectHint(e.target.value)} placeholder="e.g. Line 3 platform" />
      </label>
      <label className="look-field">
        <span className="look-field__label">What they need (your notes)</span>
        <textarea className="look-field__input" rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </label>
      <button type="submit" className="btn btn--primary">
        Save to inbox
      </button>
    </form>
  );
}
