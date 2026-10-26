"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { CONTACT_EMAIL } from "@/lib/contact";
import {
  AI_TOOL_OPTIONS,
  BUILD_QUOTES_OPTIONS,
  COMES_WITH_OPTIONS,
  EMAIL_PROVIDER_OPTIONS,
  ITAR_NOTE,
  ITAR_OPTIONS,
  KEEP_REQUESTS_OPTIONS,
  QUOTE_SOURCE_OPTIONS,
  QUOTES_PER_WEEK_OPTIONS,
  REQUEST_TO_QUOTE_OPTIONS,
  VIEW_ONLY_OPTIONS,
} from "@/lib/paid-look-intake";
import { PAID_LOOK_MAX_FILES } from "@/lib/paid-look-intake-upload";
import {
  submitPaidLookIntake,
  type PaidLookIntakeFormState,
} from "./actions";

const initialState: PaidLookIntakeFormState = { ok: false };

function SectionHeading({ children }: { children: string }) {
  return <h3 className="look-form__section">{children}</h3>;
}

function Choice({
  type,
  name,
  value,
  label,
  checked,
  onChange,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="look-choice">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

export function PaidLookIntakeForm({
  formToken,
  turnstileSiteKey,
}: {
  formToken: string;
  turnstileSiteKey?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitPaidLookIntake,
    initialState,
  );
  const [buildQuotes, setBuildQuotes] = useState("");
  const [emailProvider, setEmailProvider] = useState("");
  const [itar, setItar] = useState("");
  const [quoteSources, setQuoteSources] = useState<string[]>([]);
  const [aiTools, setAiTools] = useState<string[]>([]);

  const showItarNote = itar === "yes" || itar === "not sure";
  const showQuoteOther = quoteSources.includes("other");
  const showErpName = buildQuotes === "ERP/software";
  const showBuildOther = buildQuotes === "other";
  const showEmailOther = emailProvider === "other";
  const showAiOther = aiTools.includes("other");

  function toggleInList(
    value: string,
    list: string[],
    setList: (next: string[]) => void,
  ) {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  }

  if (state.ok) {
    return (
      <div className="look-form look-form--success" role="status">
        <p className="look-form__eyebrow">Received</p>
        <h2 className="look-form__title">Thanks — I&apos;ll show up ready.</h2>
        <p className="look-form__lead">
          I got your intake. If anything else comes up before the walkthrough,
          email me at{" "}
          <a className="cta-email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="look-form" action={formAction} encType="multipart/form-data">
      <input
        type="hidden"
        name="form_token"
        value={state.formToken ?? formToken}
      />

      <p className="look-form__eyebrow">Paid Look ($750 diagnostic)</p>
      <h2 className="look-form__title">Client intake</h2>
      <p className="look-form__lead">
        This takes about 10 minutes. It helps me show up ready so our time goes
        to fixing things, not asking basics. ~Diana
      </p>

      <SectionHeading>1. About you</SectionHeading>
      <div className="look-form__grid">
        <label className="look-field">
          <span className="look-field__label">Shop name</span>
          <input
            className="look-field__input"
            type="text"
            name="shop_name"
            autoComplete="organization"
            required
            maxLength={120}
          />
        </label>

        <label className="look-field">
          <span className="look-field__label">Your name and role</span>
          <input
            className="look-field__input"
            type="text"
            name="name_and_role"
            autoComplete="name"
            required
            maxLength={160}
          />
        </label>

        <div className="look-field" style={{ gridColumn: "1 / -1" }}>
          <span className="look-field__label">Email and best phone</span>
          <div className="look-form__grid">
            <input
              className="look-field__input"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={120}
              aria-label="Email"
            />
            <input
              className="look-field__input"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={40}
              aria-label="Best phone"
            />
          </div>
        </div>

        <label className="look-field">
          <span className="look-field__label">
            Website (if any)
          </span>
          <input
            className="look-field__input"
            type="text"
            name="website"
            autoComplete="url"
            inputMode="url"
            placeholder="yourshop.com"
            maxLength={200}
          />
        </label>

        <label className="look-field">
          <span className="look-field__label">What you make or do (one line)</span>
          <input
            className="look-field__input"
            type="text"
            name="what_you_make"
            required
            maxLength={200}
          />
        </label>
      </div>

      <label className="look-field">
        <span className="look-field__label">
          How many people work there? How many touch quotes?
        </span>
        <textarea
          className="look-field__input look-field__input--area"
          name="team_and_quotes"
          required
          minLength={4}
          maxLength={600}
          rows={3}
        />
      </label>

      <SectionHeading>2. Quote requests</SectionHeading>
      <fieldset className="look-field">
        <legend className="look-field__label">
          About how many quote requests do you get a week?
        </legend>
        <div className="look-choice-group">
          {QUOTES_PER_WEEK_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="radio"
              name="quotes_per_week"
              value={option}
              label={option}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="look-field">
        <legend className="look-field__label">Where do they come in?</legend>
        <div className="look-choice-group">
          {QUOTE_SOURCE_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="checkbox"
              name="quote_sources"
              value={option}
              label={option}
              checked={quoteSources.includes(option)}
              onChange={() =>
                toggleInList(option, quoteSources, setQuoteSources)
              }
            />
          ))}
        </div>
      </fieldset>

      {showQuoteOther ? (
        <label className="look-field">
          <span className="look-field__label">Other</span>
          <input
            className="look-field__input"
            type="text"
            name="quote_sources_other"
            maxLength={120}
          />
        </label>
      ) : (
        <input type="hidden" name="quote_sources_other" value="" />
      )}

      <fieldset className="look-field">
        <legend className="look-field__label">What usually comes with them?</legend>
        <div className="look-choice-group">
          {COMES_WITH_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="checkbox"
              name="comes_with"
              value={option}
              label={option}
            />
          ))}
        </div>
      </fieldset>

      <label className="look-field">
        <span className="look-field__label">
          What&apos;s most often missing or unclear?
        </span>
        <textarea
          className="look-field__input look-field__input--area"
          name="missing_unclear"
          required
          minLength={4}
          maxLength={800}
          rows={3}
        />
      </label>

      <fieldset className="look-field">
        <legend className="look-field__label">
          About how long from request to quote sent?
        </legend>
        <div className="look-choice-group">
          {REQUEST_TO_QUOTE_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="radio"
              name="request_to_quote"
              value={option}
              label={option}
            />
          ))}
        </div>
      </fieldset>

      <SectionHeading>3. Tools you use today</SectionHeading>
      <fieldset className="look-field">
        <legend className="look-field__label">Where do you build quotes?</legend>
        <div className="look-choice-group">
          {BUILD_QUOTES_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="radio"
              name="build_quotes"
              value={option}
              label={option === "ERP/software" ? "ERP/software [name]" : option}
              onChange={() => setBuildQuotes(option)}
            />
          ))}
        </div>
      </fieldset>

      {showErpName ? (
        <label className="look-field">
          <span className="look-field__label">ERP/software name</span>
          <input
            className="look-field__input"
            type="text"
            name="build_quotes_erp_name"
            maxLength={120}
          />
        </label>
      ) : (
        <input type="hidden" name="build_quotes_erp_name" value="" />
      )}

      {showBuildOther ? (
        <label className="look-field">
          <span className="look-field__label">Other</span>
          <input
            className="look-field__input"
            type="text"
            name="build_quotes_other"
            maxLength={120}
          />
        </label>
      ) : (
        <input type="hidden" name="build_quotes_other" value="" />
      )}

      <fieldset className="look-field">
        <legend className="look-field__label">
          Where do you keep requests and drawings?
        </legend>
        <div className="look-choice-group">
          {KEEP_REQUESTS_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="checkbox"
              name="keep_requests"
              value={option}
              label={option}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="look-field">
        <legend className="look-field__label">Email</legend>
        <div className="look-choice-group">
          {EMAIL_PROVIDER_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="radio"
              name="email_provider"
              value={option}
              label={option}
              onChange={() => setEmailProvider(option)}
            />
          ))}
        </div>
      </fieldset>

      {showEmailOther ? (
        <label className="look-field">
          <span className="look-field__label">Other</span>
          <input
            className="look-field__input"
            type="text"
            name="email_provider_other"
            maxLength={80}
          />
        </label>
      ) : (
        <input type="hidden" name="email_provider_other" value="" />
      )}

      <fieldset className="look-field">
        <legend className="look-field__label">
          Any AI tools in use, even informally?
        </legend>
        <div className="look-choice-group">
          {AI_TOOL_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="checkbox"
              name="ai_tools"
              value={option}
              label={option}
              checked={aiTools.includes(option)}
              onChange={() => toggleInList(option, aiTools, setAiTools)}
            />
          ))}
        </div>
      </fieldset>

      {showAiOther ? (
        <label className="look-field">
          <span className="look-field__label">Other</span>
          <input
            className="look-field__input"
            type="text"
            name="ai_tools_other"
            maxLength={120}
          />
        </label>
      ) : (
        <input type="hidden" name="ai_tools_other" value="" />
      )}

      <SectionHeading>4. Files and security</SectionHeading>
      <fieldset className="look-field">
        <legend className="look-field__label">
          Do any of your jobs involve ITAR, CUI, or export-controlled work?
        </legend>
        <div className="look-choice-group">
          {ITAR_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="radio"
              name="itar"
              value={option}
              label={option}
              onChange={() => setItar(option)}
            />
          ))}
        </div>
      </fieldset>

      {showItarNote ? (
        <p className="look-form__note" role="note">
          {ITAR_NOTE}
        </p>
      ) : null}

      <fieldset className="look-field">
        <legend className="look-field__label">
          If I need to see anything, can you set up a view-only account for me?
        </legend>
        <div className="look-choice-group">
          {VIEW_ONLY_OPTIONS.map((option) => (
            <Choice
              key={option}
              type="radio"
              name="view_only_account"
              value={option}
              label={option}
            />
          ))}
        </div>
      </fieldset>

      <label className="look-field">
        <span className="look-field__label">
          Anyone else I should loop in (IT person, owner, office manager)?
        </span>
        <textarea
          className="look-field__input look-field__input--area"
          name="loop_in"
          maxLength={600}
          rows={2}
        />
      </label>

      <SectionHeading>5. Where it hurts</SectionHeading>
      <label className="look-field">
        <span className="look-field__label">Where do quotes get stuck the longest?</span>
        <textarea
          className="look-field__input look-field__input--area"
          name="stuck_longest"
          required
          minLength={4}
          maxLength={800}
          rows={3}
        />
      </label>

      <label className="look-field">
        <span className="look-field__label">
          Any job you lost or passed on because the quote was slow?
        </span>
        <textarea
          className="look-field__input look-field__input--area"
          name="lost_job_slow_quote"
          required
          minLength={4}
          maxLength={800}
          rows={3}
        />
      </label>

      <label className="look-field">
        <span className="look-field__label">
          Who on your team do people trust most with new tools?
        </span>
        <input
          className="look-field__input"
          type="text"
          name="trust_new_tools"
          required
          minLength={2}
          maxLength={400}
        />
      </label>

      <label className="look-field">
        <span className="look-field__label">
          Magic wand: one thing you&apos;d fix tomorrow?
        </span>
        <textarea
          className="look-field__input look-field__input--area"
          name="magic_wand"
          required
          minLength={4}
          maxLength={800}
          rows={3}
        />
      </label>

      <SectionHeading>6. Optional upload</SectionHeading>
      <label className="look-field">
        <span className="look-field__label">
          1-3 example quote requests (with customer names removed) or a screenshot
          of your quote sheet. No ITAR/CUI files.
        </span>
        <input
          className="look-field__input"
          type="file"
          name="uploads"
          accept="application/pdf,image/*"
          multiple
        />
        <span className="look-field__hint">
          Optional — up to {PAID_LOOK_MAX_FILES} files, PDF or images, 5 MB each.
        </span>
      </label>

      <SectionHeading>7. Before we start</SectionHeading>
      <div className="look-choice-group">
        <label className="look-choice">
          <input type="checkbox" name="ack_files_handling" required />
          <span>I&apos;ve read &quot;How I handle your files&quot;</span>
        </label>
        <label className="look-choice">
          <input type="checkbox" name="ack_nda" required />
          <span>
            I&apos;ll sign the permission letter and NDA (sent separately)
          </span>
        </label>
      </div>

      <label className="look-field">
        <span className="look-field__label">Best days/times for the walkthrough</span>
        <textarea
          className="look-field__input look-field__input--area"
          name="walkthrough_times"
          required
          minLength={4}
          maxLength={600}
          rows={3}
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
        {pending ? "Sending…" : "Send intake"}
      </button>

      <p className="look-form__fine">
        Questions?{" "}
        <Link className="text-link" href="/look">
          Book a look
        </Link>{" "}
        or{" "}
        <a className="cta-email" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  );
}
