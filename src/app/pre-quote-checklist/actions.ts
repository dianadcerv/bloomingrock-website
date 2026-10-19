"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { submitInboundIntake } from "@/lib/intake-inbound";
import {
  clientIp,
  createFormToken,
  isValidEmail,
  lookEmailLimiter,
  lookIpLimiter,
  sanitizeOneLine,
  verifyFormToken,
  verifyTurnstile,
} from "@/lib/look-security";

export type ChecklistFormState = {
  ok: boolean;
  error?: string;
  formToken?: string;
};

const CHECKLIST_DETAILS = "Pre-quote checklist download";

function trim(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendChecklistEmailNotification({
  name,
  email,
  business,
}: {
  name: string;
  email: string;
  business: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim();
  const from = domain
    ? `BloomingRock <look@${domain}>`
    : "BloomingRock <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const businessLine = business
    ? `<p style="margin:0 0 8px"><strong>Business:</strong> ${escapeHtml(business)}</p>`
    : "";

  const { error } = await resend.emails.send(
    {
      from,
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
      idempotencyKey: `checklist-request/${createHash("sha256")
        .update(`${email}|${name}|${business}`)
        .digest("hex")
        .slice(0, 32)}`,
    },
  );

  return !error;
}

export async function submitChecklistRequest(
  _prev: ChecklistFormState,
  formData: FormData,
): Promise<ChecklistFormState> {
  const submittedToken = trim(formData.get("form_token"));
  const tokenStillValid = verifyFormToken(submittedToken);
  const nextToken = tokenStillValid ? submittedToken : createFormToken();

  if (trim(formData.get("company_fax"))) {
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

  const turnstileToken = trim(formData.get("cf-turnstile-response"));
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please confirm you’re human and try again.",
    };
  }

  const name = sanitizeOneLine(trim(formData.get("name")));
  const email = sanitizeOneLine(trim(formData.get("email")));
  const business = sanitizeOneLine(trim(formData.get("business")));

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

  if (
    !process.env.RESEND_API_KEY &&
    !process.env.INTAKE_INBOUND_SECRET?.trim()
  ) {
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
