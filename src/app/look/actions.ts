"use server";

import { createHash } from "node:crypto";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";

export type LookFormState = {
  ok: boolean;
  error?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function normalizeWebsite(value: string) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export async function submitLookRequest(
  _prev: LookFormState,
  formData: FormData,
): Promise<LookFormState> {
  if (trim(formData.get("company_fax"))) {
    return { ok: true };
  }

  const name = trim(formData.get("name"));
  const email = trim(formData.get("email"));
  const business = trim(formData.get("business"));
  const website = normalizeWebsite(trim(formData.get("website")));
  const week = trim(formData.get("week"));

  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Please add your name." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 120) {
    return { ok: false, error: "Please add a work email I can reply to." };
  }
  if (business.length < 2 || business.length > 120) {
    return { ok: false, error: "Please add the business name." };
  }
  if (website && website.length > 200) {
    return { ok: false, error: "That website looks too long — a homepage URL is enough." };
  }
  if (week.length < 8 || week.length > 800) {
    return {
      ok: false,
      error: "A sentence or two about where the week gets eaten up helps me prepare.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
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
            ? `<a href="${escapeHtml(website)}">${escapeHtml(website)}</a>`
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
      error: "Something went sideways sending that. Try once more, or email me directly.",
    };
  }

  return { ok: true };
}
