"use client";

import Link from "next/link";
import { useActionState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { CONTACT_EMAIL } from "@/lib/contact";
import { submitChecklistRequest, type ChecklistFormState } from "./actions";

const initialState: ChecklistFormState = { ok: false };

const PRINT_PATH = "/pre-quote-checklist/print";

export function ChecklistForm({
  formToken,
  turnstileSiteKey,
}: {
  formToken: string;
  turnstileSiteKey?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitChecklistRequest,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="look-form look-form--success" role="status">
        <p className="look-form__eyebrow">Checklist ready</p>
        <h2 className="look-form__title">Here&apos;s your copy.</h2>
        <p className="look-form__lead">
          Print it or save as PDF from your browser. If anything looks off for
          your shop, reply to the email you used — I&apos;m still tuning this
          for owner-run shops.
        </p>
        <Link className="btn btn--primary" href={PRINT_PATH}>
          Open printable checklist
        </Link>
      </div>
    );
  }

  return (
    <form className="look-form" action={formAction}>
      <input
        type="hidden"
        name="form_token"
        value={state.formToken ?? formToken}
      />
      <p className="look-form__eyebrow">Free download</p>
      <h2 className="look-form__title">Get the checklist.</h2>
      <p className="look-form__lead">
        Name and email. I&apos;ll send you to the printable page — not a
        mailing list.
      </p>

      <div className="look-form__grid">
        <label className="look-field">
          <span className="look-field__label">Your name</span>
          <input
            className="look-field__input"
            type="text"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
          />
        </label>

        <label className="look-field">
          <span className="look-field__label">Work email</span>
          <input
            className="look-field__input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={120}
          />
        </label>

        <label className="look-field" style={{ gridColumn: "1 / -1" }}>
          <span className="look-field__label">Business name (optional)</span>
          <input
            className="look-field__input"
            type="text"
            name="business"
            autoComplete="organization"
            maxLength={120}
          />
        </label>
      </div>

      <div className="look-form__hp" aria-hidden="true">
        <label>
          Company fax
          <input type="text" name="company_fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {turnstileSiteKey ? (
        <TurnstileWidget siteKey={turnstileSiteKey} />
      ) : null}

      {state.error ? (
        <p className="look-form__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="btn btn--primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send me the checklist"}
      </button>

      <p className="look-form__fine">
        Questions?{" "}
        <a className="cta-email" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  );
}
