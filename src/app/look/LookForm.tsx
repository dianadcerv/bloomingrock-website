"use client";

import { useActionState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { CONTACT_EMAIL } from "@/lib/contact";
import { submitLookRequest, type LookFormState } from "./actions";

const initialState: LookFormState = { ok: false };

export function LookForm({
  formToken,
  turnstileSiteKey,
}: {
  formToken: string;
  turnstileSiteKey?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitLookRequest,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="look-form look-form--success" role="status">
        <p className="look-form__eyebrow">You’re on the list</p>
        <h2 className="look-form__title">Got it. I’ll look before we talk.</h2>
        <p className="look-form__lead">
          I’ll review the business and reply to set a 15-minute time. No pitch
          deck — just whether there’s a quick win worth doing.
        </p>
      </div>
    );
  }

  return (
    <form className="look-form" action={formAction}>
      <input type="hidden" name="form_token" value={state.formToken ?? formToken} />
      <p className="look-form__eyebrow">Free 15-minute look</p>
      <h2 className="look-form__title">Tell me enough to prepare.</h2>
      <p className="look-form__lead">
        Four fields. I’ll use them to look at the business before we talk — not
        to build a mailing list.
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

        <label className="look-field">
          <span className="look-field__label">Business name</span>
          <input
            className="look-field__input"
            type="text"
            name="business"
            autoComplete="organization"
            required
            maxLength={120}
          />
        </label>

        <label className="look-field">
          <span className="look-field__label">
            Website <span className="look-field__optional">optional</span>
          </span>
          <input
            className="look-field__input"
            type="text"
            name="website"
            autoComplete="url"
            inputMode="url"
            placeholder="yourbusiness.com"
            maxLength={200}
          />
          <span className="look-field__hint">
            A homepage is enough. I’ll look before we talk.
          </span>
        </label>
      </div>

      <label className="look-field">
        <span className="look-field__label">
          Where does your week get eaten up?
        </span>
        <textarea
          className="look-field__input look-field__input--area"
          name="week"
          required
          minLength={8}
          maxLength={800}
          rows={4}
          placeholder="Follow-up, scheduling, inbox, reporting…"
        />
      </label>

      {turnstileSiteKey ? <TurnstileWidget siteKey={turnstileSiteKey} /> : null}

      <div className="look-honeypot" aria-hidden="true">
        <label>
          Company fax
          <input type="text" name="company_fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error ? (
        <p className="look-form__error" role="alert">
          {state.error}{" "}
          <a className="cta-email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      ) : null}

      <button className="btn btn--primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Request the 15-minute look"}
      </button>
    </form>
  );
}
