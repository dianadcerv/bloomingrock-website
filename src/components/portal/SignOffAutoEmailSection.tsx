"use client";

import { useEffect, useState } from "react";
import { OpenQuestion } from "@/components/portal/PortalUi";
import { NORTHRIDGE_BRANDING } from "@/lib/portal/admin-demo-data";
import type { DemoJob } from "@/lib/portal/demo-data";
import { getCustomerForJob, getProjectForJob } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";
import {
  getSignOffInvite,
  signOffPageUrl,
  SIGN_OFF_UPDATED_EVENT,
  type SignOffInvite,
} from "@/lib/portal/sign-off-store";

function EmailPreview({
  job,
  invite,
}: {
  job: DemoJob;
  invite: SignOffInvite;
}) {
  const customer = getCustomerForJob(job);
  const project = getProjectForJob(job);
  const b = NORTHRIDGE_BRANDING;
  const linkPath = signOffPageUrl(job.id);

  return (
    <article
      className="portal-email-preview"
      style={
        {
          "--shop-accent": b.accentColor,
          "--shop-primary": b.primaryColor,
        } as React.CSSProperties
      }
    >
      <header className="portal-email-preview__header">
        <p className="portal-email-preview__logo">{b.logoLabel}</p>
        <p className="portal-email-preview__meta">
          <span className="portal-email-preview__badge">Sent automatically</span>
          To: {invite.contact} &lt;{invite.email}&gt;
        </p>
      </header>
      <h3 className="portal-email-preview__subject">
        Sign-off code — {job.name} ({project?.name ?? "Project"})
      </h3>
      <div className="portal-email-preview__body">
        <p>Hi {invite.contact.split(" ")[0] ?? "there"},</p>
        <p>
          {customer?.name ?? "Your team"} asked Northridge Steel to finalize requirements for{" "}
          <strong>{job.name}</strong>. Review the checklist and sign when ready.
        </p>
        <p>
          <strong>One-time code:</strong>{" "}
          <span className="portal-code portal-code--inline">{invite.code}</span>
        </p>
        <p>
          <strong>Sign-off page:</strong>{" "}
          <span className="portal-email-preview__link">{linkPath}</span>
        </p>
        <p className="look-field__hint">
          This message is the only email the app sends without someone clicking Send. Other messages
          stay drafts for your shop to review first.
        </p>
      </div>
    </article>
  );
}

export function SignOffAutoEmailSection({ job }: { job: DemoJob }) {
  const [invite, setInvite] = useState<SignOffInvite | null>(null);

  useEffect(() => {
    const refresh = () => setInvite(getSignOffInvite(job.id));
    refresh();
    window.addEventListener(SIGN_OFF_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(SIGN_OFF_UPDATED_EVENT, refresh);
  }, [job.id]);

  if (!invite) {
    return (
      <p className="portal-outbound-policy look-field__hint">
        When an engineer marks requirements ready, the app automatically emails the customer contact a
        one-time code and sign-off link. That is the only outbound email without a person clicking
        Send.
      </p>
    );
  }

  return (
    <>
      <p className="portal-outbound-policy" role="status">
        <strong>Only automatic email.</strong> Sign-off codes go out without someone clicking Send.
        Every other customer email stays a <strong>draft for review</strong> until a person sends it.
      </p>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.signOffAutoEmailOnly}</OpenQuestion>
      <EmailPreview job={job} invite={invite} />
      <p className="look-field__hint">
        Sent {invite.sentAt} · Activity log: Sign-off code sent automatically to {invite.contact}
      </p>
    </>
  );
}

export function SignOffBuyerCodeHint({ jobId }: { jobId: string }) {
  const [invite, setInvite] = useState<SignOffInvite | null>(null);

  useEffect(() => {
    const refresh = () => setInvite(getSignOffInvite(jobId));
    refresh();
    window.addEventListener(SIGN_OFF_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(SIGN_OFF_UPDATED_EVENT, refresh);
  }, [jobId]);

  const code = invite?.code ?? "482917";

  return (
    <>
      <p className="portal-auth__lead">
        Secure link entry — no customer account. Enter the one-time code from your email.
      </p>
      <div className="portal-letter">
        <p className="look-field__hint">Code from your email (demo)</p>
        <p className="portal-code">{code}</p>
        <label className="look-field">
          <span className="look-field__label">One-time code</span>
          <input className="look-field__input" defaultValue={code} readOnly />
        </label>
        <button className="btn btn--primary" type="button" disabled>
          Verify code (demo)
        </button>
      </div>
    </>
  );
}
