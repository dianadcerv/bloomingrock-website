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
  verifyPaidLookUploadContents,
} from "@/lib/paid-look-intake-upload";

export type PaidLookIntakeFormState = {
  ok: boolean;
  error?: string;
  formToken?: string;
};

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

async function sendPaidLookEmailNotification({
  answers,
  attachments,
}: {
  answers: PaidLookAnswers;
  attachments: { url: string; name: string }[];
}): Promise<boolean> {
  const mailer = resendMailer();
  if (!mailer) return false;

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

  const { error } = await mailer.resend.emails.send(
    {
      from: mailer.from,
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
      idempotencyKey: resendIdempotencyKey(
        "paid-look-intake",
        `${answers.email}|${answers.shopName}|${body.slice(0, 200)}`,
      ),
    },
  );

  return !error;
}

export async function submitPaidLookIntake(
  _prev: PaidLookIntakeFormState,
  formData: FormData,
): Promise<PaidLookIntakeFormState> {
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

  const parsed = parsePaidLookIntake({
    shopName: trimFormValue(formData.get("shop_name")),
    nameAndRole: trimFormValue(formData.get("name_and_role")),
    email: trimFormValue(formData.get("email")),
    phone: trimFormValue(formData.get("phone")),
    website: trimFormValue(formData.get("website")),
    whatYouMake: trimFormValue(formData.get("what_you_make")),
    teamAndQuotes: trimFormValue(formData.get("team_and_quotes")),
    quotesPerWeek: trimFormValue(formData.get("quotes_per_week")),
    quoteSources: list(formData, "quote_sources"),
    quoteSourcesOther: trimFormValue(formData.get("quote_sources_other")),
    comesWith: list(formData, "comes_with"),
    missingUnclear: trimFormValue(formData.get("missing_unclear")),
    requestToQuote: trimFormValue(formData.get("request_to_quote")),
    buildQuotes: trimFormValue(formData.get("build_quotes")),
    buildQuotesErpName: trimFormValue(formData.get("build_quotes_erp_name")),
    buildQuotesOther: trimFormValue(formData.get("build_quotes_other")),
    keepRequests: list(formData, "keep_requests"),
    emailProvider: trimFormValue(formData.get("email_provider")),
    emailProviderOther: trimFormValue(formData.get("email_provider_other")),
    aiTools: list(formData, "ai_tools"),
    aiToolsOther: trimFormValue(formData.get("ai_tools_other")),
    itar: trimFormValue(formData.get("itar")),
    viewOnlyAccount: trimFormValue(formData.get("view_only_account")),
    loopIn: trimFormValue(formData.get("loop_in")),
    stuckLongest: trimFormValue(formData.get("stuck_longest")),
    lostJobSlowQuote: trimFormValue(formData.get("lost_job_slow_quote")),
    trustNewTools: trimFormValue(formData.get("trust_new_tools")),
    magicWand: trimFormValue(formData.get("magic_wand")),
    ackFilesHandling: checkbox(formData, "ack_files_handling"),
    ackNda: checkbox(formData, "ack_nda"),
    walkthroughTimes: trimFormValue(formData.get("walkthrough_times")),
  });

  if (!parsed.ok) {
    return { ok: false, formToken: nextToken, error: parsed.error };
  }

  const uploadList = files(formData, "uploads");
  const uploadValidation = validatePaidLookUploads(uploadList);
  if (!uploadValidation.ok) {
    return { ok: false, formToken: nextToken, error: uploadValidation.error };
  }

  const uploadContents = await verifyPaidLookUploadContents(uploadList);
  if (!uploadContents.ok) {
    return { ok: false, formToken: nextToken, error: uploadContents.error };
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

  if (intakeDeliveryNotConfigured()) {
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
