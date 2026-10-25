"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildPaidLookInboundPayload } from "@/lib/intake/paid-look-payload";
import { submitInboundIntake } from "@/lib/intake-inbound";
import {
  clientIp,
  lookEmailLimiter,
  lookIpLimiter,
  mintFormToken,
  validateFormToken,
  verifyTurnstile,
} from "@/lib/look-security";
import {
  buildPaidLookDetails,
  parsePaidLookIntake,
  type PaidLookAnswers,
} from "@/lib/paid-look-intake";
import {
  uploadPaidLookFiles,
  validatePaidLookUploads,
} from "@/lib/paid-look-intake-upload";

export type PaidLookIntakeFormState = {
  ok: boolean;
  error?: string;
  formToken?: string;
};

function trim(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function list(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function files(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendPaidLookEmailNotification({
  answers,
  attachments,
}: {
  answers: PaidLookAnswers;
  attachments: { url: string; name: string }[];
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim();
  const from = domain
    ? `BloomingRock <look@${domain}>`
    : "BloomingRock <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const attachmentBlock =
    attachments.length > 0
      ? `<p style="margin:16px 0 0"><strong>Uploads:</strong></p><ul>${attachments
          .map(
            (file) =>
              `<li><a href="${escapeHtml(file.url)}">${escapeHtml(file.name)}</a></li>`,
          )
          .join("")}</ul>`
      : "";

  const body = buildPaidLookDetails(answers);

  const { error } = await resend.emails.send(
    {
      from,
      to: CONTACT_EMAIL,
      replyTo: answers.email,
      subject: `Paid Look intake: ${answers.shopName}`,
      html: `
      <div style="font-family:Georgia,serif;color:#2C2A26;line-height:1.5">
        <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#3D6B5A;margin:0 0 8px">
          Paid Look intake
        </p>
        <pre style="margin:0;white-space:pre-wrap;font-family:Georgia,serif">${escapeHtml(body)}</pre>
        ${attachmentBlock}
      </div>
    `,
    },
    {
      idempotencyKey: `paid-look-intake/${createHash("sha256")
        .update(`${answers.email}|${answers.shopName}|${body.slice(0, 200)}`)
        .digest("hex")
        .slice(0, 32)}`,
    },
  );

  return !error;
}

export async function submitPaidLookIntake(
  _prev: PaidLookIntakeFormState,
  formData: FormData,
): Promise<PaidLookIntakeFormState> {
  const submittedToken = trim(formData.get("form_token"));
  const tokenStillValid = await validateFormToken(submittedToken);
  const nextToken = tokenStillValid ? submittedToken : await mintFormToken();

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

  const parsed = parsePaidLookIntake({
    shopName: trim(formData.get("shop_name")),
    nameAndRole: trim(formData.get("name_and_role")),
    email: trim(formData.get("email")),
    phone: trim(formData.get("phone")),
    website: trim(formData.get("website")),
    whatYouMake: trim(formData.get("what_you_make")),
    teamAndQuotes: trim(formData.get("team_and_quotes")),
    quotesPerWeek: trim(formData.get("quotes_per_week")),
    quoteSources: list(formData, "quote_sources"),
    quoteSourcesOther: trim(formData.get("quote_sources_other")),
    comesWith: list(formData, "comes_with"),
    missingUnclear: trim(formData.get("missing_unclear")),
    requestToQuote: trim(formData.get("request_to_quote")),
    buildQuotes: trim(formData.get("build_quotes")),
    buildQuotesErpName: trim(formData.get("build_quotes_erp_name")),
    buildQuotesOther: trim(formData.get("build_quotes_other")),
    keepRequests: list(formData, "keep_requests"),
    emailProvider: trim(formData.get("email_provider")),
    emailProviderOther: trim(formData.get("email_provider_other")),
    aiTools: list(formData, "ai_tools"),
    aiToolsOther: trim(formData.get("ai_tools_other")),
    itar: trim(formData.get("itar")),
    viewOnlyAccount: trim(formData.get("view_only_account")),
    loopIn: trim(formData.get("loop_in")),
    stuckLongest: trim(formData.get("stuck_longest")),
    lostJobSlowQuote: trim(formData.get("lost_job_slow_quote")),
    trustNewTools: trim(formData.get("trust_new_tools")),
    magicWand: trim(formData.get("magic_wand")),
    ackFilesHandling: checkbox(formData, "ack_files_handling"),
    ackNda: checkbox(formData, "ack_nda"),
    walkthroughTimes: trim(formData.get("walkthrough_times")),
  });

  if (!parsed.ok) {
    return { ok: false, formToken: nextToken, error: parsed.error };
  }

  const uploadList = files(formData, "uploads");
  const uploadValidation = validatePaidLookUploads(uploadList);
  if (!uploadValidation.ok) {
    return { ok: false, formToken: nextToken, error: uploadValidation.error };
  }

  const emailKey = parsed.answers.email.toLowerCase();
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

  let attachments: Awaited<ReturnType<typeof uploadPaidLookFiles>> = [];
  if (uploadList.length > 0) {
    try {
      attachments = await uploadPaidLookFiles(uploadList);
    } catch {
      return {
        ok: false,
        formToken: nextToken,
        error:
          "The uploads did not go through. Try again without files, or email me directly.",
      };
    }
  }

  const { answers, contactName } = parsed;

  const portalOk = await submitInboundIntake(
    buildPaidLookInboundPayload(answers, contactName, attachments),
  );

  let emailOk = false;
  if (!portalOk) {
    emailOk = await sendPaidLookEmailNotification({
      answers,
      attachments,
    });
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
        "The form isn’t connected yet. Email me directly and I’ll send next steps.",
    };
  }

  return {
    ok: false,
    formToken: nextToken,
    error:
      "Something went sideways sending that. Try once more, or email me directly.",
  };
}
