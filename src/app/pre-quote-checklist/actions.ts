"use server";

import { headers } from "next/headers";
import { CONTACT_EMAIL } from "@/lib/contact";
import {
  escapeHtml,
  intakeDeliveryNotConfigured,
  resendIdempotencyKey,
  resendMailer,
  trimFormValue,
} from "@/lib/form-server";
import { submitInboundIntake } from "@/lib/intake-inbound";
import {
  clientIp,
  isValidEmail,
  lookEmailLimiter,
  lookIpLimiter,
  mintFormToken,
  sanitizeOneLine,
  validateFormToken,
  verifyTurnstile,
} from "@/lib/look-security";

export type ChecklistFormState = {
  ok: boolean;
  error?: string;
  formToken?: string;
};

const CHECKLIST_DETAILS = "Pre-quote checklist download";

async function sendChecklistEmailNotification({
  name,
  email,
  business,
}: {
  name: string;
  email: string;
  business: string;
}): Promise<boolean> {
  const mailer = resendMailer();
  if (!mailer) return false;

  const businessLine = business
    ? `<p style="margin:0 0 8px"><strong>Business:</strong> ${escapeHtml(business)}</p>`
    : "";

  const { error } = await mailer.resend.emails.send(
    {
      from: mailer.from,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Pre-quote checklist: ${name}`,
      html: `
      <div style="font-family:Georgia,serif;color:#2C2A26;line-height:1.5">
        <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#3D6B5A;margin:0 0 8px">
          Pre-quote checklist download
        </p>
        <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${businessLine}
        <p style="margin:0">${escapeHtml(CHECKLIST_DETAILS)}</p>
      </div>
    `,
    },
    {
      idempotencyKey: resendIdempotencyKey(
        "checklist-request",
        `${email}|${name}|${business}`,
      ),
    },
  );

  return !error;
}

export async function submitChecklistRequest(
  _prev: ChecklistFormState,
  formData: FormData,
): Promise<ChecklistFormState> {
  const submittedToken = trimFormValue(formData.get("form_token"));
  const tokenStillValid = await validateFormToken(submittedToken);
  const nextToken = tokenStillValid ? submittedToken : await mintFormToken();

  if (trimFormValue(formData.get("company_fax"))) {
    return { ok: true };
  }

  const ip = clientIp(await headers());

  if (!tokenStillValid) {
    return {
      ok: false,
      formToken: nextToken,
      error: "That request expired. Refresh the page and try once more.",
    };
  }

  const turnstileToken = trimFormValue(formData.get("cf-turnstile-response"));
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return {
      ok: false,
      formToken: nextToken,
      error:
        "Please check the box to show you're not a bot, then try again.",
    };
  }

  const name = sanitizeOneLine(trimFormValue(formData.get("name")));
  const email = sanitizeOneLine(trimFormValue(formData.get("email")));
  const business = sanitizeOneLine(trimFormValue(formData.get("business")));

  if (name.length < 2 || name.length > 80) {
    return { ok: false, formToken: nextToken, error: "Please add your name." };
  }
  if (!isValidEmail(email)) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please add a work email I can reply to.",
    };
  }
  if (business.length > 120) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please keep the business name short.",
    };
  }

  const emailKey = email.toLowerCase();
  if (
    !lookIpLimiter.consume(`ip:${ip}`) ||
    !lookEmailLimiter.consume(`email:${emailKey}`)
  ) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please wait a few minutes before sending another request.",
    };
  }

  const portalOk = await submitInboundIntake({
    name,
    email,
    business: business || name,
    details: CHECKLIST_DETAILS,
    source: "website-checklist",
  });

  let emailOk = false;
  if (!portalOk) {
    emailOk = await sendChecklistEmailNotification({ name, email, business });
  }

  if (portalOk || emailOk) {
    return { ok: true };
  }

  if (intakeDeliveryNotConfigured()) {
    return {
      ok: false,
      formToken: nextToken,
      error:
        "The form isn’t connected yet. Email me directly and I’ll send the checklist.",
    };
  }

  return {
    ok: false,
    formToken: nextToken,
    error:
      "Something went sideways sending that. Try once more, or email me directly.",
  };
}
