import { createHash } from "node:crypto";
import { Resend } from "resend";

export function trimFormValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function resendMailer(): { resend: Resend; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim();
  const from = domain
    ? `BloomingRock <look@${domain}>`
    : "BloomingRock <onboarding@resend.dev>";
  return { resend: new Resend(apiKey), from };
}

export function intakeDeliveryNotConfigured(): boolean {
  return !process.env.RESEND_API_KEY && !process.env.INTAKE_INBOUND_SECRET?.trim();
}

export function resendIdempotencyKey(prefix: string, seed: string): string {
  return `${prefix}/${createHash("sha256").update(seed).digest("hex").slice(0, 32)}`;
}
