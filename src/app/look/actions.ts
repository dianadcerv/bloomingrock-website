"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import {
  clientIp,
  createFormToken,
  isValidEmail,
  lookEmailLimiter,
  lookIpLimiter,
  normalizeWebsite,
  sanitizeMultiline,
  sanitizeOneLine,
  verifyFormToken,
  verifyTurnstile,
} from "@/lib/look-security";

export type LookFormState = {
  ok: boolean;
  error?: string;
  formToken?: string;
};

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

function websiteHref(url: string) {
  return escapeHtml(url);
}

export async function submitLookRequest(
  _prev: LookFormState,
  formData: FormData,
): Promise<LookFormState> {
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
  const week = sanitizeMultiline(trim(formData.get("week")));
  const websiteResult = normalizeWebsite(trim(formData.get("website")));

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
  if (business.length < 2 || business.length > 120) {
    return { ok: false, formToken: nextToken, error: "Please add the business name." };
  }
  if (!websiteResult.ok || websiteResult.url.length > 200) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please use a regular website address (example.com).",
    };
  }
  if (week.length < 8 || week.length > 800) {
    return {
      ok: false,
      formToken: nextToken,
      error: "A sentence or two about where the week gets eaten up helps me prepare.",
    };
  }

  const website = websiteResult.url;
  const emailKey = email.toLowerCase();
  if (!lookIpLimiter.consume(`ip:${ip}`) || !lookEmailLimiter.consume(`email:${emailKey}`)) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please wait a few minutes before sending another request.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      formToken: nextToken,
      error: "The form isn’t connected yet. Email me directly and I’ll get you on the calendar.",
    };
  }

  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim();
  const from = domain
    ? `BloomingRock <look@${domain}>`
    : "BloomingRock <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send(
    {
      from,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `15-minute look: ${business}`,
      html: `
      <div style="font-family:Georgia,serif;color:#2C2A26;line-height:1.5">
        <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#3D6B5A;margin:0 0 8px">
          15-minute look
        </p>
        <h1 style="font-size:22px;font-weight:500;margin:0 0 16px">
          ${escapeHtml(business)}
        </h1>
        <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0 0 8px"><strong>Business:</strong> ${escapeHtml(business)}</p>
        <p style="margin:0 0 16px"><strong>Website:</strong> ${
          website
            ? `<a href="${websiteHref(website)}">${escapeHtml(website)}</a>`
            : "Not given"
        }</p>
        <p style="margin:0 0 6px"><strong>Where the week gets eaten up:</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(week)}</p>
      </div>
    `,
    },
    {
      idempotencyKey: `look-request/${createHash("sha256")
        .update(`${email}|${business}|${week}`)
        .digest("hex")
        .slice(0, 32)}`,
    },
  );

  if (error) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Something went sideways sending that. Try once more, or email me directly.",
    };
  }

  return { ok: true };
}
