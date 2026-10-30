"use client";

import { useState } from "react";
import { PoweredByBloomingRock } from "@/components/portal/PoweredByBloomingRock";
import { submitWebsiteQuote } from "@/lib/portal/intake-store";
import { NORTHRIDGE_BRANDING } from "@/lib/portal/admin-demo-data";

export function WebsiteQuoteForm({ embedded }: { embedded?: boolean }) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [done, setDone] = useState(false);
  const b = NORTHRIDGE_BRANDING;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWebsiteQuote({ contactName, contactEmail, company, projectDescription });
    setDone(true);
  };

  return (
    <div
      className={`customer-upload customer-upload--quote${embedded ? " customer-upload--embedded" : ""}`}
      style={
        {
          "--shop-accent": b.accentColor,
          "--shop-primary": b.primaryColor,
        } as React.CSSProperties
      }
    >
      <header className="customer-upload__header">
        <p className="customer-upload__shop">{b.logoLabel}</p>
        <h1>Request a quote</h1>
      </header>
      {done ? (
        <p role="status">Thanks — we received your request and will follow up soon.</p>
      ) : (
        <form className="portal-form" onSubmit={submit}>
          <label className="look-field">
            <span className="look-field__label">Your name</span>
            <input className="look-field__input" required value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </label>
          <label className="look-field">
            <span className="look-field__label">Email</span>
            <input className="look-field__input" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </label>
          <label className="look-field">
            <span className="look-field__label">Company</span>
            <input className="look-field__input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </label>
          <label className="look-field">
            <span className="look-field__label">What do you need fabricated?</span>
            <textarea className="look-field__input" rows={4} required value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
          </label>
          <button type="submit" className="btn btn--primary">
            Send request
          </button>
        </form>
      )}
      <PoweredByBloomingRock />
    </div>
  );
}
