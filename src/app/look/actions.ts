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
  normalizeWebsite,
  sanitizeMultiline,
  sanitizeOneLine,
  validateFormToken,
  verifyTurnstile,
} from "@/lib/look-security";
import { HEARD_ABOUT_OPTIONS } from "./heard-about-options";
import { lookPainTopicLabels, parseLookPainTopics } from "./look-pain-topics";

export type LookFormState = {
  ok: boolean;
  error?: string;
  formToken?: string;
};

function websiteHref(url: string) {
  return escapeHtml(url);
}

function parseHeardAbout(
  selectRaw: string,
  otherRaw: string,
): { heardAbout?: string; error?: string } {
  if (!selectRaw) return {};

  const match = HEARD_ABOUT_OPTIONS.find(
    (option) => option.toLowerCase() === selectRaw.toLowerCase(),
  );
  if (!match) {
    return { error: "Please pick how you heard about us, or leave it blank." };
  }

  const other = sanitizeOneLine(otherRaw);
  if (match === "Other") {
    if (other.length > 200) {
      return { error: "Please keep that to a short phrase." };
    }
    return { heardAbout: other ? `Other: ${other}` : "Other" };
  }

  if (other.length > 0) {
    return { error: "The extra line is only needed when you pick Other." };
  }

  return { heardAbout: match };
}

function buildDetails(week: string, website: string, painTopicLabels: string[]) {
  const parts = [week];
  if (painTopicLabels.length > 0) {
    parts.push(`Topics: ${painTopicLabels.join(", ")}`);
  }
  if (website) {
    parts.push(`Website: ${website}`);
  }
  return parts.join("\n\n");
}

async function sendLookEmailNotification({
  name,
  email,
  business,
  week,
  website,
  heardAbout,
  painTopicLabels,
}: {
  name: string;
  email: string;
  business: string;
  week: string;
  website: string;
  heardAbout?: string;
  painTopicLabels: string[];
}): Promise<boolean> {
  const mailer = resendMailer();
  if (!mailer) return false;

  const heardBlock = heardAbout
    ? `<p style="margin:0 0 16px"><strong>How they heard about us:</strong> ${escapeHtml(heardAbout)}</p>`
    : "";

  const topicsBlock =
    painTopicLabels.length > 0
      ? `<p style="margin:0 0 16px"><strong>Pain topics:</strong> ${escapeHtml(painTopicLabels.join(", "))}</p>`
      : "";

  const { error } = await mailer.resend.emails.send(
    {
      from: mailer.from,
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
        ${heardBlock}
        ${topicsBlock}
        <p style="margin:0 0 6px"><strong>Where the week gets eaten up:</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(week)}</p>
      </div>
    `,
    },
    {
      idempotencyKey: resendIdempotencyKey(
        "look-request",
        `${email}|${business}|${week}`,
      ),
    },
  );

  return !error;
}

export async function submitLookRequest(
  _prev: LookFormState,
  formData: FormData,
): Promise<LookFormState> {
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
      error: "Please confirm you’re human and try again.",
    };
  }

  const name = sanitizeOneLine(trimFormValue(formData.get("name")));
  const email = sanitizeOneLine(trimFormValue(formData.get("email")));
  const business = sanitizeOneLine(trimFormValue(formData.get("business")));
  const week = sanitizeMultiline(trimFormValue(formData.get("week")));
  const websiteResult = normalizeWebsite(trimFormValue(formData.get("website")));
  const heardResult = parseHeardAbout(
    trimFormValue(formData.get("heard_about")),
    trimFormValue(formData.get("heard_about_other")),
  );
  const painTopicIds = parseLookPainTopics(formData.getAll("pain_topics"));
  const painTopicLabels = lookPainTopicLabels(painTopicIds);

  if (heardResult.error) {
    return { ok: false, formToken: nextToken, error: heardResult.error };
  }

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
  const heardAbout = heardResult.heardAbout;
  const emailKey = email.toLowerCase();
  if (!lookIpLimiter.consume(`ip:${ip}`) || !lookEmailLimiter.consume(`email:${emailKey}`)) {
    return {
      ok: false,
      formToken: nextToken,
      error: "Please wait a few minutes before sending another request.",
    };
  }

  const details = buildDetails(week, website, painTopicLabels);
  const portalOk = await submitInboundIntake({
    name,
    email,
    business,
    details,
    ...(heardAbout ? { heardAbout } : {}),
    ...(painTopicIds.length > 0
      ? { inboundExtras: { painTopics: painTopicIds } }
      : {}),
    source: "website-look",
  });

  let emailOk = false;
  if (!portalOk) {
    emailOk = await sendLookEmailNotification({
      name,
      email,
      business,
      week,
      website,
      heardAbout,
      painTopicLabels,
    });
  }

  if (portalOk || emailOk) {
    return { ok: true };
  }

  if (intakeDeliveryNotConfigured()) {
    return {
      ok: false,
      formToken: nextToken,
      error: "The form isn’t connected yet. Email me directly and I’ll get you on the calendar.",
    };
  }

  return {
    ok: false,
    formToken: nextToken,
    error: "Something went sideways sending that. Try once more, or email me directly.",
  };
}
