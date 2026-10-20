"use client";

import { useActionState } from "react";
import { requestMagicLink, type LoginState } from "@/app/portal/login/actions";

const initial: LoginState = { ok: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(requestMagicLink, initial);

  return (
    <form className="portal-login" action={formAction}>
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
          placeholder="you@company.com"
        />
      </label>
      {state.error ? (
        <p className="look-form__error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn btn--primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Next"}
      </button>
    </form>
  );
}
