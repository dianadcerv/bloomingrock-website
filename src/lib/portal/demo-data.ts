export type SourceKind = "email" | "sketch" | "pdf" | "call" | "note" | "cad" | "zip";
export type SourceStatus = "reviewed" | "needs-review" | "conflict";
export type CheckStatus = "complete" | "missing" | "conflict" | "assumed";
export type ReviewState = "needs-review" | "confirmed";
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
  readByApp?: boolean;
  quote?: string;
};

export type DemoCheckItem = {
  id: string;
  label: string;
  status: CheckStatus;
  reviewState: ReviewState;
  value?: string;
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
  owner?: string;
  draft: string;
  sent: false;
};

export type DemoBomRow = {
  id: string;
  group: string;
  description: string;
  qty: string;
  material: string;
  vendor: string;
  vendorPart: string;
  notes: string;
};

export type WorkflowStep = {
  id: string;
  label: string;
  kind: "minimum" | "ideal" | "added";
  done: boolean;
};

export type AuditEntry = {
  id: string;
  at: string;
  who: string;
  action: string;
  detail: string;
};

export type DemoJob = {
  id: string;
  name: string;
  projectId: string;
  status: JobStatus;
  summary: string;
  revision: number;
  sources: DemoSource[];
  checklist: DemoCheckItem[];
  conflicts: DemoConflict[];
  questions: DemoQuestion[];
  workflow: WorkflowStep[];
  bom: DemoBomRow[];
  knowledge: string[];
  auditLog: AuditEntry[];
  controlledProposal?: boolean;
};

export type DemoProject = {
  id: string;
  name: string;
  customerId: string;
  site: string;
  jobIds: string[];
};

export type DemoCustomer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  projectIds: string[];
};

export type InboxItem = {
  id: string;
  subject: string;
  from: string;
  suggested: {
    customer: string;
    customerId: string;
    projectId: string;
    project: string;
    jobIds: string[];
    jobs: string[];
  };
  snippet: string;
  bodyPreview: string;
  attachments: string[];
};

export const DEMO_BANNER = "FAKE DATA, DEMO ONLY";

export const DEMO_SHOP = {
  name: "Northridge Steel",
  legal: "Northridge Steel Fabrication LLC",
  location: "Rockford, IL",
  brandColor: "#2f4a3c",
};

export const DEMO_CUSTOMER: DemoCustomer = {
  id: "meridian",
  name: "Meridian Food Plants",
  contact: "Jordan Hale",
  email: "jordan@meridian.demo",
  projectIds: ["line-3"],
};

export const DEMO_PROJECT: DemoProject = {
  id: "line-3",
  name: "Line 3 upgrade",
  customerId: DEMO_CUSTOMER.id,
  site: "Line 3, Rockford plant",
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
    readByApp: true,
    quote: "…need clear width of 48 inches between the rails…",
  },
  {
    id: "sketch-1",
    kind: "sketch",
    title: "Rough sketch from the walkthrough",
    from: "Uploaded by Maya Chen",
    summary: "Hand sketch of stairs and landing. Width callout reads 54 inches.",
    status: "conflict",
    readByApp: true,
    quote: "Callout on landing: 54\" clear",
  },
  {
    id: "pdf-1",
    kind: "pdf",
    title: "Site photos PDF",
    from: "Jordan Hale",
    summary: "Four photos of the Line 3 mezzanine. No load rating or finish called out.",
    status: "reviewed",
    readByApp: true,
  },
  {
    id: "call-1",
    kind: "call",
    title: "Call notes + transcript (demo transcription)",
    from: "Maya Chen / Jordan Hale",
    summary:
      "Jordan mentioned customer-side install and anchoring into existing concrete. Values below are AI suggestions — a person must review.",
    status: "needs-review",
    readByApp: true,
    quote: "Jordan: we'll handle install ourselves if you deliver knocked down… anchor into the existing slab.",
  },
  {
    id: "cad-1",
    kind: "cad",
    title: "Mezzanine reference.dxf",
    from: "Jordan Hale",
    summary: "CAD attachment stored only — not read in this demo.",
    status: "reviewed",
    readByApp: false,
  },
];

const ACCESS_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    at: "2026-10-08 09:14 CT",
    who: "Maya Chen",
    action: "Confirmed inbox match",
    detail: "Message in-1 attached to Industrial access platform.",
  },
  {
    id: "a2",
    at: "2026-10-08 09:22 CT",
    who: "App (demo)",
    action: "OCR + draft values",
    detail: "Pulled clear width 48 in. from email; 54 in. from sketch. Marked needs review.",
  },
  {
    id: "a3",
    at: "2026-10-09 14:05 CT",
    who: "Maya Chen",
    action: "Uploaded transcript",
    detail: "Demo transcription from walkthrough-call.m4a — consent step not decided (open question).",
  },
  {
    id: "a4",
    at: "2026-10-10 11:40 CT",
    who: "Maya Chen",
    action: "Drafted customer question",
    detail: "Width + load rating + finish + install + anchoring — DRAFT, NOT SENT.",
  },
];

export const JOBS: DemoJob[] = [
  {
    id: "access-platform",
    name: "Industrial access platform",
    projectId: "line-3",
    status: "conflict",
    revision: 0,
    summary:
      "Stairs, landing, and handrails for Line 3. Width disagrees across sources. Load rating, finish, install, and anchoring still missing.",
    sources: ACCESS_SOURCES,
    checklist: [
      {
        id: "width",
        label: "Clear width",
        status: "conflict",
        reviewState: "needs-review",
        value: "48 in. vs 54 in.",
        sourceIds: ["email-1", "sketch-1"],
        note: "AI suggestion — person must pick or ask customer.",
      },
      {
        id: "load",
        label: "Load rating",
        status: "missing",
        reviewState: "needs-review",
        sourceIds: ["pdf-1"],
      },
      {
        id: "finish",
        label: "Finish",
        status: "missing",
        reviewState: "needs-review",
        sourceIds: [],
      },
      {
        id: "install",
        label: "Who installs",
        status: "missing",
        reviewState: "needs-review",
        value: "Customer install (from call — unconfirmed)",
        sourceIds: ["call-1"],
        note: "Suggested from transcript; not confirmed in writing.",
      },
      {
        id: "anchor",
        label: "Anchoring",
        status: "missing",
        reviewState: "needs-review",
        value: "Into existing slab (from call — unconfirmed)",
        sourceIds: ["call-1"],
      },
      {
        id: "rail-height",
        label: "Rail height",
        status: "assumed",
        reviewState: "needs-review",
        value: "42 in.",
        sourceIds: [],
        note: "Shop knowledge suggestion — person must confirm.",
      },
      {
        id: "stair-angle",
        label: "Stair angle",
        status: "assumed",
        reviewState: "needs-review",
        value: "37°",
        sourceIds: ["sketch-1"],
        note: "Shop knowledge suggestion from sketch context.",
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
        owner: "Maya Chen (estimator)",
        draft:
          "Hi Jordan — before we lock the platform, we have 48 in. in your email and 54 in. on the sketch. Which width should we build to?",
        sent: false,
      },
      {
        id: "q-load",
        prompt: "What live load should the platform be designed for?",
        askedOf: "customer",
        owner: "Maya Chen (estimator)",
        draft:
          "Also missing: load rating, paint/galvanize, who installs, and how you want anchoring into the existing slab.",
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
      {
        id: "b1",
        group: "Structure",
        description: "W8×31 beams, landing frame",
        qty: "1 set",
        material: "A992 steel",
        vendor: "Demo Metals Supply",
        vendorPart: "W8×31-20",
        notes: "Lengths TBD after width resolved",
      },
      {
        id: "b2",
        group: "Decking",
        description: "Bar grating, serrated",
        qty: "120 sf",
        material: "Steel grating",
        vendor: "Demo Grating Co.",
        vendorPart: "SG-1×1/8",
        notes: "Finish TBD",
      },
      {
        id: "b3",
        group: "Stairs",
        description: "Stair treads, checkered plate",
        qty: "14",
        material: "A36 plate",
        vendor: "Northridge (in-house)",
        vendorPart: "—",
        notes: "Angle TBD",
      },
      {
        id: "b4",
        group: "Rails",
        description: "Handrail and mid-rail assembly",
        qty: "64 lf",
        material: "Pipe + flat bar",
        vendor: "Northridge (in-house)",
        vendorPart: "—",
        notes: "42 in. suggested, not confirmed",
      },
      {
        id: "b5",
        group: "Anchors",
        description: "Slab anchors and embed plates",
        qty: "TBD",
        material: "Galv. anchors",
        vendor: "Demo Fastener House",
        vendorPart: "ANCH-TBD",
        notes: "Spec missing",
      },
    ],
    knowledge: [
      "Rail height 42 in. unless the customer specifies otherwise.",
      "Stair angle 37 degrees for industrial access unless the site is tight.",
    ],
    auditLog: ACCESS_AUDIT,
  },
  {
    id: "machine-guard",
    name: "Machine guard",
    projectId: "line-3",
    status: "waiting-on-customer",
    revision: 0,
    summary: "Small welded guard for the Line 3 infeed. Waiting on opening size.",
    sources: [
      {
        id: "email-2",
        kind: "email",
        title: "Also a small guard while you're here",
        from: "Jordan Hale",
        summary: "Mentions a machine guard on the same project. No dimensions.",
        status: "needs-review",
        readByApp: true,
      },
    ],
    checklist: [
      {
        id: "opening",
        label: "Opening size",
        status: "missing",
        reviewState: "needs-review",
        sourceIds: ["email-2"],
      },
    ],
    conflicts: [],
    questions: [
      {
        id: "q-opening",
        prompt: "What is the opening the guard has to cover?",
        askedOf: "customer",
        owner: "Maya Chen (estimator)",
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
      {
        id: "g1",
        group: "Guard",
        description: "Welded mesh panel and frame",
        qty: "1",
        material: "A36 + mesh",
        vendor: "Northridge (in-house)",
        vendorPart: "—",
        notes: "Size missing",
      },
    ],
    knowledge: [],
    auditLog: [
      {
        id: "g-a1",
        at: "2026-10-08 09:18 CT",
        who: "Maya Chen",
        action: "Confirmed inbox match (dual attach)",
        detail: "Message in-2 attached to Machine guard and cross-linked from access platform email thread.",
      },
    ],
    controlledProposal: true,
  },
];

export const INBOX_ITEMS: InboxItem[] = [
  {
    id: "in-1",
    subject: "Need a platform off Line 3",
    from: "Jordan Hale · Meridian Food Plants",
    suggested: {
      customer: DEMO_CUSTOMER.name,
      customerId: DEMO_CUSTOMER.id,
      projectId: DEMO_PROJECT.id,
      project: DEMO_PROJECT.name,
      jobIds: ["access-platform"],
      jobs: ["Industrial access platform"],
    },
    snippet: "Can you quote an access platform with stairs and handrails…",
    bodyPreview:
      "Hi Maya — we need an access platform off Line 3 with stairs and handrails. Clear width about 48 inches. Photos attached.",
    attachments: ["site-photos.pdf"],
  },
  {
    id: "in-2",
    subject: "Also a small guard while you're here",
    from: "Jordan Hale · Meridian Food Plants",
    suggested: {
      customer: DEMO_CUSTOMER.name,
      customerId: DEMO_CUSTOMER.id,
      projectId: DEMO_PROJECT.id,
      project: DEMO_PROJECT.name,
      jobIds: ["access-platform", "machine-guard"],
      jobs: ["Industrial access platform", "Machine guard"],
    },
    snippet: "Same project — we need a guard on the infeed…",
    bodyPreview:
      "While you're quoting the platform, we also need a small guard on the Line 3 infeed. No dimensions yet — can send next week.",
    attachments: [],
  },
  {
    id: "in-3",
    subject: "Photos from Thursday",
    from: "Jordan Hale · Meridian Food Plants",
    suggested: {
      customer: DEMO_CUSTOMER.name,
      customerId: DEMO_CUSTOMER.id,
      projectId: DEMO_PROJECT.id,
      project: DEMO_PROJECT.name,
      jobIds: ["access-platform"],
      jobs: ["Industrial access platform"],
    },
    snippet: "Attached a PDF of the Line 3 mezzanine…",
    bodyPreview: "Following up with mezzanine photos from Thursday's walkthrough.",
    attachments: ["line3-mezzanine-photos.pdf", "mezzanine-reference.dxf"],
  },
];

export const DEMO_TRANSCRIPT = {
  fileName: "walkthrough-call.m4a",
  demoTranscriptionLabel: "DEMO TRANSCRIPTION — not from a live service",
  text: `Maya: Thanks for walking the line with us today.
Jordan: We can handle install ourselves if you deliver knocked down.
Maya: Anchors into the existing slab?
Jordan: Yes, engineer will review anchor locations after you send a layout.`,
};

export function getJob(id: string) {
  return JOBS.find((job) => job.id === id) ?? null;
}

export function getInboxItem(id: string) {
  return INBOX_ITEMS.find((item) => item.id === id) ?? null;
}

export function getCustomer(id: string) {
  if (id === DEMO_CUSTOMER.id) return DEMO_CUSTOMER;
  return null;
}

export function getProject(id: string) {
  if (id === DEMO_PROJECT.id) return DEMO_PROJECT;
  return null;
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

export function projectRollup(jobIds: string[]) {
  const jobs = jobIds.map((id) => getJob(id)).filter(Boolean) as DemoJob[];
  const labels = jobs.map((j) => `${j.name}: ${jobStatusLabel(j.status)}`);
  return labels.join(" · ");
}
