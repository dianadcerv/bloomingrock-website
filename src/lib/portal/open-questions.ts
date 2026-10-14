/** Placeholders for undecided product questions — do not invent behavior. */
export const PROTOTYPE_OPEN_QUESTIONS = {
  consentCheckbox: "W2.1 — Is a recording-consent checkbox required on every upload?",
  consentIfUnchecked: "W2.2 — If consent is not confirmed, block upload or store without extraction?",
  illinoisConsent: "W2.3 — Is one checkbox enough for Illinois all-party consent and multi-state calls? (Not legal advice.)",
  transcriptIntegration: "W2.4 — Which transcript tool integrates first after scoping? (Quo / Dialpad are candidates only.)",
  liveRecording: "W2.13 — Should the app record calls live? If so, how and when?",
  transcriptionService: "W2.16 — Which service transcribes uploaded audio and video?",
  signOffPageLayout: "W4.1 — Which parts of the proposed sign-off page design do we keep?",
  codeEmailOutgoing: "W4.2 / BLO-21 — Does the one-time code email count as outgoing communication?",
  missingBlocksSign: "W4.3 — Do missing minimum requirements block signing?",
  conflictsBlockSign: "W4.4 — Do unresolved conflicts block signing?",
  revisionsResign: "W4.5–W4.7 — Revisions, re-signing, and signing order",
  signOffLegal: "W4.8 — What does the sign-off mean legally?",
  assumptionsOnPage: "W4.9 — Show shop-knowledge items as customer-facing assumptions?",
  openQuestionsOwners: "W4.10 — List open questions with an owner on the sign-off page?",
  changeRequestChannel: "W4.11 — How does the customer ask for changes?",
  linkCodeExpiry: "W4.12 — How long do the link and code stay valid?",
  workOrderWho: "W5.1 — Who creates and approves the work order?",
  customerSignsWorkOrder: "W5.2 — Does the customer sign the work order?",
  workOrderContents: "W5.3 — What does a real work order contain? (Placeholder until shop example.)",
  pdfContents: "W5.4 — What goes in the PDF?",
  bomDraftVsHand: "W5.6 — How much of each BOM line is drafted vs filled by hand?",
  bomDownloadFormat: "W5.7 — Excel, CSV, or both for BOM download?",
  ocrTool: "W1.10 — Which OCR tool, and how well does it read handwriting and drawings?",
  statusNames: "W3.2 — Stage 1 status values vs sign-off labels on screen",
  addedStepsBlock: "W3.3 — Do added workflow steps block sign-off?",
  workflowEditPermissions: "Who may edit workflows on a job, and who must approve changes?",
  knowledgeApproval: "Does expert knowledge need approval before it can be suggested on other jobs?",
  templateVsJobScope:
    "Do workflow edits change only this job, or the shop template? (Template editing is Phase 2 shop admin — not in this prototype.)",
  workflowVersioningRollback: "Versioning and rollback rules when steps are moved, edited, or removed.",
  interpretationAccuracyHarness:
    "What accuracy harness will we build around AI interpretations?",
  appNameBLO38: "BLO-38 — Product name undecided; “Job Intake App” is the working title in this prototype.",
  managedServicePricing:
    "Managed service onboarding — pricing and timeline with consulting (superadmin view).",
  emailAutoAttachLearning:
    "When should project email auto-attach vs require a person to confirm the match?",
  shopUserTypePermissions:
    "Fine-grained permission differences between Estimator, Engineer, Sales, and Materials (demo treats them as equal).",
  brandingWebsiteExtract:
    "How reliably should website URL inherit logo and colors in production?",
} as const;

export const DEMO_SHOP_ROLES = [
  "Estimator",
  "Reviewer",
  "Engineer",
  "Owner / admin",
  "Fabricator",
] as const;
