import type { PaidLookAnswers } from "@/lib/paid-look-intake";
import { buildPaidLookDetails } from "@/lib/paid-look-intake";
import type {
  PaidLookInboundPayload,
  PaidLookUploadFile,
} from "@/lib/intake/paid-look-sections";

export function buildPaidLookInboundPayload(
  answers: PaidLookAnswers,
  contactName: string,
  uploads: PaidLookUploadFile[],
): PaidLookInboundPayload {
  return {
    name: contactName,
    email: answers.email,
    business: answers.shopName,
    source: "website-paid-look",
    details: buildPaidLookDetails(answers),
    aboutYou: {
      shopName: answers.shopName,
      nameAndRole: answers.nameAndRole,
      email: answers.email,
      phone: answers.phone,
      website: answers.website,
      whatYouMake: answers.whatYouMake,
      teamAndQuotes: answers.teamAndQuotes,
    },
    quoteRequests: {
      quotesPerWeek: answers.quotesPerWeek,
      quoteSources: answers.quoteSources,
      comesWith: answers.comesWith,
      missingUnclear: answers.missingUnclear,
      requestToQuote: answers.requestToQuote,
    },
    tools: {
      buildQuotes: answers.buildQuotes,
      keepRequests: answers.keepRequests,
      emailProvider: answers.emailProvider,
      aiTools: answers.aiTools,
    },
    filesAndSecurity: {
      itarCui: answers.itar,
      viewOnlyAccount: answers.viewOnlyAccount,
      loopIn: answers.loopIn,
    },
    whereItHurts: {
      stuckLongest: answers.stuckLongest,
      lostJobSlowQuote: answers.lostJobSlowQuote,
      trustNewTools: answers.trustNewTools,
      magicWand: answers.magicWand,
    },
    uploads: { files: uploads },
    beforeWeStart: {
      readHowIHandleFiles: answers.ackFilesHandling,
      signPermissionLetterNda: answers.ackNda,
      walkthroughTimes: answers.walkthroughTimes,
    },
  };
}
