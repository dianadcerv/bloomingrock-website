import {
  isValidEmail,
  normalizeWebsite,
  sanitizeMultiline,
  sanitizeOneLine,
} from "@/lib/look-security";

export const QUOTES_PER_WEEK_OPTIONS = ["0-5", "6-15", "16-40", "40+"] as const;

export const QUOTE_SOURCE_OPTIONS = [
  "email",
  "phone",
  "web form",
  "text",
  "walk-in",
  "customer portal",
  "other",
] as const;

export const COMES_WITH_OPTIONS = [
  "drawings",
  "PDFs",
  "specs",
  "photos",
  "sample part",
  "nothing",
] as const;

export const REQUEST_TO_QUOTE_OPTIONS = [
  "same day",
  "1-3 days",
  "a week",
  "longer",
] as const;

export const BUILD_QUOTES_OPTIONS = ["Excel", "paper", "ERP/software", "other"] as const;

export const KEEP_REQUESTS_OPTIONS = [
  "email folders",
  "shared drive",
  "Dropbox",
  "ERP",
  "paper",
] as const;

export const EMAIL_PROVIDER_OPTIONS = ["Gmail", "Outlook", "other"] as const;

export const AI_TOOL_OPTIONS = ["ChatGPT", "Copilot", "other", "none"] as const;

export const ITAR_OPTIONS = ["yes", "no", "not sure"] as const;

export const VIEW_ONLY_OPTIONS = ["yes", "no", "need help"] as const;

export const ITAR_NOTE =
  "If yes or not sure, those jobs stay out of this work.";

export type PaidLookAnswers = {
  shopName: string;
  nameAndRole: string;
  email: string;
  phone: string;
  website: string;
  whatYouMake: string;
  teamAndQuotes: string;
  quotesPerWeek: (typeof QUOTES_PER_WEEK_OPTIONS)[number];
  quoteSources: string[];
  comesWith: string[];
  missingUnclear: string;
  requestToQuote: (typeof REQUEST_TO_QUOTE_OPTIONS)[number];
  buildQuotes: string;
  keepRequests: string[];
  emailProvider: string;
  aiTools: string[];
  itar: (typeof ITAR_OPTIONS)[number];
  viewOnlyAccount: (typeof VIEW_ONLY_OPTIONS)[number];
  loopIn: string;
  stuckLongest: string;
  lostJobSlowQuote: string;
  trustNewTools: string;
  magicWand: string;
  ackFilesHandling: boolean;
  ackNda: boolean;
  walkthroughTimes: string;
};

export type ParsedPaidLookIntake =
  | { ok: true; answers: PaidLookAnswers; contactName: string }
  | { ok: false; error: string };

function pickOne<T extends readonly string[]>(
  raw: string,
  options: T,
  label: string,
): T[number] | { error: string } {
  const match = options.find((option) => option.toLowerCase() === raw.toLowerCase());
  if (!match) {
    return { error: `Please choose ${label}.` };
  }
  return match;
}

function pickMany(rawValues: string[], allowed: readonly string[]): string[] {
  const normalized = allowed.filter((option) =>
    rawValues.some((value) => value.toLowerCase() === option.toLowerCase()),
  );
  return normalized;
}

function parseBuildQuotes(raw: string, erpName: string, other: string) {
  const choice = pickOne(raw, BUILD_QUOTES_OPTIONS, "where you build quotes");
  if (typeof choice !== "string") return choice;

  if (choice === "ERP/software") {
    const name = sanitizeOneLine(erpName);
    if (name.length < 1 || name.length > 120) {
      return { error: "Please add the ERP or software name." };
    }
    return { ok: true as const, value: `ERP/software: ${name}` };
  }

  if (choice === "other") {
    const otherText = sanitizeOneLine(other);
    if (otherText.length < 1 || otherText.length > 120) {
      return { error: "Please say where you build quotes." };
    }
    return { ok: true as const, value: `other: ${otherText}` };
  }

  return { ok: true as const, value: choice };
}

function parseEmailProvider(raw: string, other: string) {
  const choice = pickOne(raw, EMAIL_PROVIDER_OPTIONS, "your email provider");
  if (typeof choice !== "string") return choice;

  if (choice === "other") {
    const otherText = sanitizeOneLine(other);
    if (otherText.length < 1 || otherText.length > 80) {
      return { error: "Please say which email you use." };
    }
    return { ok: true as const, value: `other: ${otherText}` };
  }

  return { ok: true as const, value: choice };
}

function parseQuoteSources(rawValues: string[], other: string) {
  const selected = pickMany(rawValues, QUOTE_SOURCE_OPTIONS);
  const otherText = sanitizeOneLine(other);
  const hasOther = selected.includes("other");

  if (hasOther && otherText.length < 1) {
    return { error: "Please say where else quote requests come in." };
  }
  if (!hasOther && otherText.length > 0) {
    return { error: 'The extra line is only needed when you check "other".' };
  }

  if (selected.length === 0) {
    return { error: "Please pick at least one place quote requests come in." };
  }

  const values = selected.map((item) =>
    item === "other" && otherText ? `other: ${otherText}` : item,
  );
  return { ok: true as const, value: values };
}

function parseAiTools(rawValues: string[], other: string) {
  const selected = pickMany(rawValues, AI_TOOL_OPTIONS);
  const otherText = sanitizeOneLine(other);
  const hasOther = selected.includes("other");
  const hasNone = selected.includes("none");

  if (selected.length === 0) {
    return { error: "Please pick at least one AI tool option, or none." };
  }
  if (hasNone && selected.length > 1) {
    return { error: 'Pick "none" by itself, or choose the tools you use.' };
  }
  if (hasOther && otherText.length < 1) {
    return { error: "Please say which other AI tools you use." };
  }
  if (!hasOther && otherText.length > 0) {
    return { error: 'The extra line is only needed when you check "other".' };
  }

  const values = selected.map((item) =>
    item === "other" && otherText ? `other: ${otherText}` : item,
  );
  return { ok: true as const, value: values };
}

export function contactNameFromAnswers(nameAndRole: string) {
  const cleaned = sanitizeOneLine(nameAndRole);
  const firstSegment = cleaned.split(/[,–—-]/)[0]?.trim() ?? cleaned;
  return firstSegment.length >= 2 ? firstSegment.slice(0, 80) : cleaned.slice(0, 80);
}

export function buildPaidLookDetails(answers: PaidLookAnswers) {
  const lines = [
    "Paid Look ($750 diagnostic) client intake",
    "",
    "1. About you",
    `Shop name: ${answers.shopName}`,
    `Your name and role: ${answers.nameAndRole}`,
    `Email: ${answers.email}`,
    `Phone: ${answers.phone}`,
    `Website: ${answers.website || "Not given"}`,
    `What you make or do: ${answers.whatYouMake}`,
    `Team / quotes: ${answers.teamAndQuotes}`,
    "",
    "2. Quote requests",
    `Quote requests per week: ${answers.quotesPerWeek}`,
    `Where they come in: ${answers.quoteSources.join(", ")}`,
    `What usually comes with them: ${answers.comesWith.join(", ") || "Not given"}`,
    `Most often missing or unclear: ${answers.missingUnclear}`,
    `Request to quote sent: ${answers.requestToQuote}`,
    "",
    "3. Tools you use today",
    `Where quotes are built: ${answers.buildQuotes}`,
    `Where requests and drawings live: ${answers.keepRequests.join(", ")}`,
    `Email: ${answers.emailProvider}`,
    `AI tools: ${answers.aiTools.join(", ")}`,
    "",
    "4. Files and security",
    `ITAR / CUI / export-controlled: ${answers.itar}`,
    `View-only account: ${answers.viewOnlyAccount}`,
    `Loop in: ${answers.loopIn || "Not given"}`,
    "",
    "5. Where it hurts",
    `Stuck longest: ${answers.stuckLongest}`,
    `Lost or passed job (slow quote): ${answers.lostJobSlowQuote}`,
    `Trust with new tools: ${answers.trustNewTools}`,
    `Magic wand: ${answers.magicWand}`,
    "",
    "7. Before we start",
    `Read how files are handled: yes`,
    `Permission letter and NDA: yes`,
    `Walkthrough times: ${answers.walkthroughTimes}`,
  ];
  return lines.join("\n");
}

export function parsePaidLookIntake(input: {
  shopName: string;
  nameAndRole: string;
  email: string;
  phone: string;
  website: string;
  whatYouMake: string;
  teamAndQuotes: string;
  quotesPerWeek: string;
  quoteSources: string[];
  quoteSourcesOther: string;
  comesWith: string[];
  missingUnclear: string;
  requestToQuote: string;
  buildQuotes: string;
  buildQuotesErpName: string;
  buildQuotesOther: string;
  keepRequests: string[];
  emailProvider: string;
  emailProviderOther: string;
  aiTools: string[];
  aiToolsOther: string;
  itar: string;
  viewOnlyAccount: string;
  loopIn: string;
  stuckLongest: string;
  lostJobSlowQuote: string;
  trustNewTools: string;
  magicWand: string;
  ackFilesHandling: boolean;
  ackNda: boolean;
  walkthroughTimes: string;
}): ParsedPaidLookIntake {
  const shopName = sanitizeOneLine(input.shopName);
  const nameAndRole = sanitizeOneLine(input.nameAndRole);
  const email = sanitizeOneLine(input.email);
  const phone = sanitizeOneLine(input.phone);
  const whatYouMake = sanitizeOneLine(input.whatYouMake);
  const teamAndQuotes = sanitizeMultiline(input.teamAndQuotes);
  const missingUnclear = sanitizeMultiline(input.missingUnclear);
  const loopIn = sanitizeMultiline(input.loopIn);
  const stuckLongest = sanitizeMultiline(input.stuckLongest);
  const lostJobSlowQuote = sanitizeMultiline(input.lostJobSlowQuote);
  const trustNewTools = sanitizeMultiline(input.trustNewTools);
  const magicWand = sanitizeMultiline(input.magicWand);
  const walkthroughTimes = sanitizeMultiline(input.walkthroughTimes);
  const websiteResult = normalizeWebsite(input.website);

  if (shopName.length < 2 || shopName.length > 120) {
    return { ok: false, error: "Please add the shop name." };
  }
  if (nameAndRole.length < 2 || nameAndRole.length > 160) {
    return { ok: false, error: "Please add your name and role." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Please add a work email I can reply to." };
  }
  if (phone.length < 7 || phone.length > 40) {
    return { ok: false, error: "Please add a best phone number." };
  }
  if (!websiteResult.ok || websiteResult.url.length > 200) {
    return {
      ok: false,
      error: "Please use a regular website address (example.com), or leave it blank.",
    };
  }
  if (whatYouMake.length < 2 || whatYouMake.length > 200) {
    return { ok: false, error: "Please add what you make or do in one line." };
  }
  if (teamAndQuotes.length < 4 || teamAndQuotes.length > 600) {
    return {
      ok: false,
      error: "Please say how many people work there and how many touch quotes.",
    };
  }

  const quotesPerWeek = pickOne(input.quotesPerWeek, QUOTES_PER_WEEK_OPTIONS, "quote volume");
  if (typeof quotesPerWeek !== "string") {
    return { ok: false, error: quotesPerWeek.error };
  }

  const quoteSourcesResult = parseQuoteSources(
    input.quoteSources,
    input.quoteSourcesOther,
  );
  if ("error" in quoteSourcesResult) {
    return { ok: false, error: quoteSourcesResult.error ?? "Please check quote sources." };
  }

  const comesWith = pickMany(input.comesWith, COMES_WITH_OPTIONS);
  if (comesWith.length === 0) {
    return {
      ok: false,
      error: "Please pick what usually comes with quote requests.",
    };
  }

  if (missingUnclear.length < 4 || missingUnclear.length > 800) {
    return {
      ok: false,
      error: "Please say what's most often missing or unclear.",
    };
  }

  const requestToQuote = pickOne(
    input.requestToQuote,
    REQUEST_TO_QUOTE_OPTIONS,
    "timing from request to quote",
  );
  if (typeof requestToQuote !== "string") {
    return { ok: false, error: requestToQuote.error };
  }

  const buildQuotesResult = parseBuildQuotes(
    input.buildQuotes,
    input.buildQuotesErpName,
    input.buildQuotesOther,
  );
  if ("error" in buildQuotesResult) {
    return { ok: false, error: buildQuotesResult.error };
  }

  const keepRequests = pickMany(input.keepRequests, KEEP_REQUESTS_OPTIONS);
  if (keepRequests.length === 0) {
    return {
      ok: false,
      error: "Please pick where you keep requests and drawings.",
    };
  }

  const emailProviderResult = parseEmailProvider(
    input.emailProvider,
    input.emailProviderOther,
  );
  if ("error" in emailProviderResult) {
    return { ok: false, error: emailProviderResult.error };
  }

  const aiToolsResult = parseAiTools(input.aiTools, input.aiToolsOther);
  if ("error" in aiToolsResult) {
    return { ok: false, error: aiToolsResult.error ?? "Please check AI tools." };
  }

  const itar = pickOne(input.itar, ITAR_OPTIONS, "ITAR / CUI / export-controlled");
  if (typeof itar !== "string") {
    return { ok: false, error: itar.error };
  }

  const viewOnlyAccount = pickOne(
    input.viewOnlyAccount,
    VIEW_ONLY_OPTIONS,
    "view-only account setup",
  );
  if (typeof viewOnlyAccount !== "string") {
    return { ok: false, error: viewOnlyAccount.error };
  }

  if (loopIn.length > 600) {
    return { ok: false, error: "Please keep the loop-in list shorter." };
  }

  if (stuckLongest.length < 4 || stuckLongest.length > 800) {
    return { ok: false, error: "Please say where quotes get stuck the longest." };
  }
  if (lostJobSlowQuote.length < 4 || lostJobSlowQuote.length > 800) {
    return {
      ok: false,
      error: "Please answer about a job you lost or passed on because the quote was slow.",
    };
  }
  if (trustNewTools.length < 2 || trustNewTools.length > 400) {
    return {
      ok: false,
      error: "Please say who people trust most with new tools.",
    };
  }
  if (magicWand.length < 4 || magicWand.length > 800) {
    return {
      ok: false,
      error: "Please share the one thing you'd fix tomorrow.",
    };
  }

  if (!input.ackFilesHandling) {
    return {
      ok: false,
      error: 'Please confirm you\'ve read "How I handle your files".',
    };
  }
  if (!input.ackNda) {
    return {
      ok: false,
      error: "Please confirm you'll sign the permission letter and NDA.",
    };
  }
  if (walkthroughTimes.length < 4 || walkthroughTimes.length > 600) {
    return {
      ok: false,
      error: "Please add best days/times for the walkthrough.",
    };
  }

  const answers: PaidLookAnswers = {
    shopName,
    nameAndRole,
    email,
    phone,
    website: websiteResult.url,
    whatYouMake,
    teamAndQuotes,
    quotesPerWeek,
    quoteSources: quoteSourcesResult.value,
    comesWith,
    missingUnclear,
    requestToQuote,
    buildQuotes: buildQuotesResult.value,
    keepRequests,
    emailProvider: emailProviderResult.value,
    aiTools: aiToolsResult.value,
    itar,
    viewOnlyAccount,
    loopIn,
    stuckLongest,
    lostJobSlowQuote,
    trustNewTools,
    magicWand,
    ackFilesHandling: true,
    ackNda: true,
    walkthroughTimes,
  };

  return {
    ok: true,
    answers,
    contactName: contactNameFromAnswers(nameAndRole),
  };
}
