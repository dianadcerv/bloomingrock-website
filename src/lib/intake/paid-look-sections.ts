/**
 * Field keys and labels for Paid Look website intake.
 * Keep in sync with command-center `src/lib/intake/paid-look-sections.ts` (PR #10).
 */
export const PAID_LOOK_SECTIONS = {
  aboutYou: {
    shopName: "Shop name",
    nameAndRole: "Your name and role",
    email: "Email",
    phone: "Best phone",
    website: "Website (if any)",
    whatYouMake: "What you make or do (one line)",
    teamAndQuotes: "How many people work there? How many touch quotes?",
  },
  quoteRequests: {
    quotesPerWeek: "About how many quote requests do you get a week?",
    quoteSources: "Where do they come in?",
    comesWith: "What usually comes with them?",
    missingUnclear: "What's most often missing or unclear?",
    requestToQuote: "About how long from request to quote sent?",
  },
  tools: {
    buildQuotes: "Where do you build quotes?",
    keepRequests: "Where do you keep requests and drawings?",
    emailProvider: "Email",
    aiTools: "Any AI tools in use, even informally?",
  },
  filesAndSecurity: {
    itarCui: "Do any of your jobs involve ITAR, CUI, or export-controlled work?",
    viewOnlyAccount:
      "If I need to see anything, can you set up a view-only account for me?",
    loopIn: "Anyone else I should loop in (IT person, owner, office manager)?",
  },
  whereItHurts: {
    stuckLongest: "Where do quotes get stuck the longest?",
    lostJobSlowQuote:
      "Any job you lost or passed on because the quote was slow?",
    trustNewTools: "Who on your team do people trust most with new tools?",
    magicWand: "Magic wand: one thing you'd fix tomorrow?",
  },
  beforeWeStart: {
    readHowIHandleFiles: 'I\'ve read "How I handle your files"',
    signPermissionLetterNda:
      "I'll sign the permission letter and NDA (sent separately)",
    walkthroughTimes: "Best days/times for the walkthrough",
  },
} as const;

export type PaidLookUploadFile = {
  url: string;
  /** Blob store pathname for authenticated download (private stores). */
  pathname?: string;
  name: string;
  contentType: string;
  size?: number;
};

export type PaidLookInboundSections = {
  aboutYou: Record<keyof typeof PAID_LOOK_SECTIONS.aboutYou, string>;
  quoteRequests: {
    quotesPerWeek: string;
    quoteSources: string[];
    comesWith: string[];
    missingUnclear: string;
    requestToQuote: string;
  };
  tools: {
    buildQuotes: string;
    keepRequests: string[];
    emailProvider: string;
    aiTools: string[];
  };
  filesAndSecurity: Record<
    keyof typeof PAID_LOOK_SECTIONS.filesAndSecurity,
    string
  >;
  whereItHurts: Record<keyof typeof PAID_LOOK_SECTIONS.whereItHurts, string>;
  uploads: { files: PaidLookUploadFile[] };
  beforeWeStart: {
    readHowIHandleFiles: boolean;
    signPermissionLetterNda: boolean;
    walkthroughTimes: string;
  };
};

export type PaidLookInboundPayload = {
  name: string;
  email: string;
  business: string;
  source: "website-paid-look";
  details: string;
} & PaidLookInboundSections;
