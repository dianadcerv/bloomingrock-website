export type SourceKind = "email" | "sketch" | "pdf" | "call" | "note";
export type SourceStatus = "reviewed" | "needs-review" | "conflict";
export type CheckStatus = "complete" | "missing" | "conflict" | "assumed";
export type JobStatus =
  | "needs-match"
  | "gathering"
  | "conflict"
  | "waiting-on-customer"
  | "ready-for-signoff"
  | "signed";

export type DemoSource = {
  id: string;
  kind: SourceKind;
  title: string;
  from: string;
  summary: string;
  status: SourceStatus;
};

export type DemoCheckItem = {
  id: string;
  label: string;
  status: CheckStatus;
  sourceIds: string[];
  note?: string;
};

export type DemoConflict = {
  id: string;
  field: string;
  left: { sourceId: string; value: string };
  right: { sourceId: string; value: string };
};

export type DemoQuestion = {
  id: string;
  prompt: string;
  askedOf: "customer" | "shop";
  draft: string;
  sent: false;
};

export type DemoBomRow = {
  id: string;
  group: string;
  item: string;
  qty: string;
  notes: string;
};

export type WorkflowStep = {
  id: string;
  label: string;
  kind: "minimum" | "ideal" | "added";
  done: boolean;
};

export type DemoJob = {
  id: string;
  name: string;
  projectId: string;
  status: JobStatus;
  summary: string;
  sources: DemoSource[];
  checklist: DemoCheckItem[];
  conflicts: DemoConflict[];
  questions: DemoQuestion[];
  workflow: WorkflowStep[];
  bom: DemoBomRow[];
  knowledge: string[];
  controlledProposal?: boolean;
};

export type DemoProject = {
  id: string;
  name: string;
  customer: string;
  site: string;
  jobIds: string[];
};

export const DEMO_BANNER = "FAKE DATA, DEMO ONLY";

export const DEMO_SHOP = {
  name: "Northridge Steel",
  legal: "Northridge Steel Fabrication LLC",
  location: "Rockford, IL",
};

export const DEMO_CUSTOMER = {
  name: "Meridian Food Plants",
  contact: "Jordan Hale",
  site: "Line 3, Rockford plant",
};

export const DEMO_PROJECT: DemoProject = {
  id: "line-3",
  name: "Line 3 upgrade",
  customer: DEMO_CUSTOMER.name,
  site: DEMO_CUSTOMER.site,
  jobIds: ["access-platform", "machine-guard"],
};

const ACCESS_SOURCES: DemoSource[] = [
  {
    id: "email-1",
    kind: "email",
    title: "Need a platform off Line 3",
    from: "Jordan Hale <jordan@meridian.demo>",
    summary:
      "Asks for a steel access platform with stairs and handrails. Mentions a 48-inch clear width.",
    status: "conflict",
  },
  {
    id: "sketch-1",
    kind: "sketch",
    title: "Rough sketch from the walkthrough",
    from: "Uploaded by Maya Chen",
    summary: "Hand sketch of stairs and landing. Width callout reads 54 inches.",
    status: "conflict",
  },
  {
    id: "pdf-1",
    kind: "pdf",
    title: "Site photos PDF",
    from: "Jordan Hale",
    summary: "Four photos of the Line 3 mezzanine. No load rating or finish called out.",
    status: "reviewed",
  },
  {
    id: "call-1",
    kind: "call",
    title: "Call notes + transcript",
    from: "Maya Chen / Jordan Hale",
    summary:
      "Jordan said they will install. Anchoring into existing concrete. Consent recorded.",
    status: "needs-review",
  },
];

export const JOBS: DemoJob[] = [
  {
    id: "access-platform",
    name: "Industrial access platform",
    projectId: "line-3",
    status: "conflict",
    summary:
      "Stairs, landing, and handrails for Line 3. Width disagrees across sources. Load rating, finish, install, and anchoring still open.",
    sources: ACCESS_SOURCES,
    checklist: [
      {
        id: "width",
        label: "Clear width",
        status: "conflict",
        sourceIds: ["email-1", "sketch-1"],
        note: "Email 48 in. vs sketch 54 in.",
      },
      {
        id: "load",
        label: "Load rating",
        status: "missing",
        sourceIds: ["pdf-1"],
      },
      {
        id: "finish",
        label: "Finish",
        status: "missing",
        sourceIds: [],
      },
      {
        id: "install",
        label: "Who installs",
        status: "assumed",
        sourceIds: ["call-1"],
        note: "Customer installs — from the call, not yet confirmed in writing.",
      },
      {
        id: "anchor",
        label: "Anchoring",
        status: "missing",
        sourceIds: ["call-1"],
      },
      {
        id: "rail-height",
        label: "Rail height",
        status: "assumed",
        sourceIds: [],
        note: "Shop knowledge: 42 in. OSHA walking-working surface.",
      },
      {
        id: "stair-angle",
        label: "Stair angle",
        status: "assumed",
        sourceIds: ["sketch-1"],
        note: "Shop knowledge: 37 degrees unless the customer says otherwise.",
      },
    ],
    conflicts: [
      {
        id: "width-conflict",
        field: "Clear width",
        left: { sourceId: "email-1", value: "48 in." },
        right: { sourceId: "sketch-1", value: "54 in." },
      },
    ],
    questions: [
      {
        id: "q-width",
        prompt: "Which clear width should we hold — 48 in. from the email, or 54 in. from the sketch?",
        askedOf: "customer",
        draft:
          "Hi Jordan — before we lock the platform, we have 48 in. in your email and 54 in. on the sketch. Which width should we build to?",
        sent: false,
      },
      {
        id: "q-load",
        prompt: "What live load should the platform be designed for?",
        askedOf: "customer",
        draft:
          "Also missing: load rating, paint/galvanize, and whether Northridge anchors into the existing slab or you handle that.",
        sent: false,
      },
    ],
    workflow: [
      { id: "intake", label: "Intake sources", kind: "minimum", done: true },
      { id: "checklist", label: "Fill the requirements checklist", kind: "minimum", done: false },
      { id: "conflicts", label: "Resolve conflicts", kind: "minimum", done: false },
      { id: "customer-q", label: "Send missing-info questions", kind: "ideal", done: false },
      { id: "site-walk", label: "Confirm site dimensions on a walk", kind: "added", done: false },
      { id: "eng-review", label: "Engineering review", kind: "minimum", done: false },
      { id: "signoff", label: "Customer + engineer sign-off", kind: "minimum", done: false },
    ],
    bom: [
      { id: "b1", group: "Structure", item: "W8 beams, landing frame", qty: "1 set", notes: "No prices" },
      { id: "b2", group: "Structure", item: "Stair stringers", qty: "2", notes: "Angle TBD" },
      { id: "b3", group: "Decking", item: "Bar grating, serrated", qty: "120 sf", notes: "Finish TBD" },
      { id: "b4", group: "Rails", item: "Handrail and kick plate", qty: "64 lf", notes: "42 in. assumed" },
      { id: "b5", group: "Anchors", item: "Slab anchors", qty: "TBD", notes: "Missing spec" },
    ],
    knowledge: [
      "Rail height 42 in. unless the customer specifies otherwise.",
      "Stair angle 37 degrees for industrial access unless the site is tight.",
    ],
  },
  {
    id: "machine-guard",
    name: "Machine guard",
    projectId: "line-3",
    status: "waiting-on-customer",
    summary: "Small welded guard for the Line 3 infeed. Waiting on opening size.",
    sources: [
      {
        id: "email-2",
        kind: "email",
        title: "Also a small guard while you're here",
        from: "Jordan Hale",
        summary: "Mentions a machine guard on the same project. No dimensions.",
        status: "needs-review",
      },
    ],
    checklist: [
      {
        id: "opening",
        label: "Opening size",
        status: "missing",
        sourceIds: ["email-2"],
      },
    ],
    conflicts: [],
    questions: [
      {
        id: "q-opening",
        prompt: "What is the opening the guard has to cover?",
        askedOf: "customer",
        draft:
          "Jordan — for the small guard on Line 3, what opening size should we hold? Height, width, and which side the hinge is on.",
        sent: false,
      },
    ],
    workflow: [
      { id: "intake", label: "Intake sources", kind: "minimum", done: true },
      { id: "checklist", label: "Fill the requirements checklist", kind: "minimum", done: false },
      { id: "signoff", label: "Customer + engineer sign-off", kind: "minimum", done: false },
    ],
    bom: [
      { id: "g1", group: "Guard", item: "Welded mesh panel", qty: "1", notes: "Size missing" },
    ],
    knowledge: [],
    controlledProposal: true,
  },
];

export const INBOX_ITEMS = [
  {
    id: "in-1",
    subject: "Need a platform off Line 3",
    from: "Jordan Hale · Meridian Food Plants",
    suggested: { customer: "Meridian Food Plants", jobId: "access-platform", job: "Industrial access platform" },
    snippet: "Can you quote an access platform with stairs and handrails…",
  },
  {
    id: "in-2",
    subject: "Also a small guard while you're here",
    from: "Jordan Hale · Meridian Food Plants",
    suggested: { customer: "Meridian Food Plants", jobId: "machine-guard", job: "Machine guard" },
    snippet: "Same project — we need a guard on the infeed…",
  },
  {
    id: "in-3",
    subject: "Photos from Thursday",
    from: "Jordan Hale · Meridian Food Plants",
    suggested: { customer: "Meridian Food Plants", jobId: "access-platform", job: "Industrial access platform" },
    snippet: "Attached a PDF of the Line 3 mezzanine…",
  },
];

export function getJob(id: string) {
  return JOBS.find((job) => job.id === id) ?? null;
}

export function getSource(job: DemoJob, sourceId: string) {
  return job.sources.find((source) => source.id === sourceId) ?? null;
}

export function jobStatusLabel(status: JobStatus) {
  switch (status) {
    case "needs-match":
      return "Needs a match";
    case "gathering":
      return "Gathering";
    case "conflict":
      return "Conflict";
    case "waiting-on-customer":
      return "Waiting on customer";
    case "ready-for-signoff":
      return "Ready for sign-off";
    case "signed":
      return "Signed";
  }
}

export function checkStatusLabel(status: CheckStatus) {
  switch (status) {
    case "complete":
      return "Complete";
    case "missing":
      return "Missing";
    case "conflict":
      return "Conflict";
    case "assumed":
      return "Shop assumption";
  }
}
