"use server";

import { redirect } from "next/navigation";
import { isValidEmail, SlidingWindowLimiter } from "@/lib/look-security";
import { normalizeEmail } from "@/lib/portal/session";

export type LoginState = { ok: boolean; error?: string };

const limiter = new SlidingWindowLimiter(15 * 60 * 1000, 8);

export async function requestMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  if (!isValidEmail(email)) {
    return { ok: false, error: "Enter a work email." };
  }

  if (!limiter.consume(normalizeEmail(email))) {
    return { ok: false, error: "Wait a few minutes, then try again." };
  }

  // Always continue — do not tell the visitor whether the email is enrolled.
  redirect(`/login/sent?email=${encodeURIComponent(normalizeEmail(email))}`);
}
