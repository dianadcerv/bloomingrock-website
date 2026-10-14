/** Phase 2 admin — fake demo data only (BLO-29). */

export type ShopLifecyclePhase = "onboarding" | "customer-success";

export type ShopEngagementType = "managed-service" | "project-based";

export type DemoShopRecord = {
  id: string;
  name: string;
  phase: ShopLifecyclePhase;
  engagement: ShopEngagementType;
  primaryContact: string;
  onboarding: {
    id: string;
    label: string;
    done: boolean;
    detail: string;
  }[];
};

export type ShopEmployee = {
  id: string;
  name: string;
  email: string;
  userType: "Estimator" | "Engineer" | "Sales" | "Materials";
  permissionsNote: string;
};

export type ProductCategoryAdmin = {
  id: string;
  label: string;
  setupAtOnboarding: boolean;
  defaultWorkflowSummary: string;
  checklistSummary: string;
  knowledgeCategoryHref: string;
  pendingSuggestedCount: number;
};

export const WORKING_APP_TITLE = "Job Intake App";

export const DEMO_ADMIN_SHOPS: DemoShopRecord[] = [
  {
    id: "northridge",
    name: "Northridge Steel",
    phase: "customer-success",
    engagement: "project-based",
    primaryContact: "Maya Chen",
    onboarding: [
      {
        id: "wf",
        label: "Design default workflow at first meeting",
        done: true,
        detail: "Access platforms happy path + ideal steps agreed Oct 2026.",
      },
      {
        id: "cat",
        label: "Set up at least one product category + workflow",
        done: true,
        detail: "Access platforms category live; links to knowledge suggestions.",
      },
      {
        id: "brand",
        label: "Branding setup",
        done: true,
        detail: "Logo + lichen/stone palette (demo).",
      },
      {
        id: "users",
        label: "Add initial users",
        done: true,
        detail: "Maya (admin), Riley (engineer), sales/materials slots open.",
      },
    ],
  },
  {
    id: "lakeview-fab",
    name: "Lakeview Fabrication (demo)",
    phase: "onboarding",
    engagement: "managed-service",
    primaryContact: "Pending kickoff",
    onboarding: [
      {
        id: "wf",
        label: "Design default workflow at first meeting",
        done: false,
        detail: "Kickoff scheduled — no template yet.",
      },
      {
        id: "cat",
        label: "Set up at least one product category + workflow",
        done: false,
        detail: "Waiting on first category workshop.",
      },
      {
        id: "brand",
        label: "Branding setup",
        done: false,
        detail: "Will inherit from website or upload logo in admin.",
      },
      {
        id: "users",
        label: "Add initial users",
        done: false,
        detail: "Shop admin account not created yet.",
      },
    ],
  },
];

export const NORTHRIDGE_EMPLOYEES: ShopEmployee[] = [
  {
    id: "emp-maya",
    name: "Maya Chen",
    email: "maya@northridge.demo",
    userType: "Estimator",
    permissionsNote: "Shop admin — full shop settings + jobs.",
  },
  {
    id: "emp-riley",
    name: "Riley Ortiz",
    email: "riley@northridge.demo",
    userType: "Engineer",
    permissionsNote: "Same job permissions as Estimator/Sales/Materials in demo.",
  },
  {
    id: "emp-sales",
    name: "Pat Nguyen",
    email: "pat@northridge.demo",
    userType: "Sales",
    permissionsNote: "Demo placeholder — not a login in this prototype.",
  },
  {
    id: "emp-mat",
    name: "Sam Brooks",
    email: "sam@northridge.demo",
    userType: "Materials",
    permissionsNote: "Demo placeholder — BOM + vendor views TBD.",
  },
];

/** Demo: all four shop user types share the same permission set; names are customizable. */
export const SHOP_USER_TYPE_PERMISSIONS = [
  { action: "View jobs for this shop", estimator: true, engineer: true, sales: true, materials: true, customer: false },
  { action: "Edit checklists & workflows on a job", estimator: true, engineer: true, sales: true, materials: true, customer: false },
  { action: "Propose / approve mutual workflow changes", estimator: true, engineer: true, sales: true, materials: true, customer: true },
  { action: "Internal knowledge library", estimator: true, engineer: true, sales: true, materials: true, customer: false },
  { action: "Shop admin settings", estimator: false, engineer: false, sales: false, materials: false, customer: false },
  { action: "Customer light — own company jobs only", estimator: false, engineer: false, sales: false, materials: false, customer: true },
] as const;

export const NORTHRIDGE_CATEGORIES: ProductCategoryAdmin[] = [
  {
    id: "access-platforms",
    label: "Access platforms",
    setupAtOnboarding: true,
    defaultWorkflowSummary: "Intake → checklist → conflicts → customer questions → site walk → eng review → sign-off",
    checklistSummary: "Width, load, finish, install, anchoring, rail height, stair angle (+ revision row in demo job)",
    knowledgeCategoryHref: "/knowledge/categories/access-platforms",
    pendingSuggestedCount: 2,
  },
  {
    id: "exterior-stairs",
    label: "Exterior stairs",
    setupAtOnboarding: false,
    defaultWorkflowSummary: "Not configured — shop admin adds template in Phase 2.",
    checklistSummary: "Harborview stair job uses job-level checklist only in demo.",
    knowledgeCategoryHref: "/knowledge/categories/exterior-stairs",
    pendingSuggestedCount: 0,
  },
];

export const NORTHRIDGE_BRANDING = {
  mode: "manual" as const,
  logoLabel: "Northridge wordmark (demo upload)",
  primaryColor: "#2f4a3c",
  accentColor: "#7a9e6a",
  websiteInheritUrl: "",
  websiteInheritPreview: null as null | { primary: string; accent: string; note: string },
};

export const INTEGRATIONS_DEMO = {
  connected: [
    {
      id: "gmail",
      name: "Gmail",
      status: "connected" as const,
      detail: "Demo — project emails gathered from linked participants; match suggested, person confirms.",
    },
    {
      id: "m365",
      name: "Microsoft 365",
      status: "available" as const,
      detail: "Demo — same flow as Gmail when connected.",
    },
    {
      id: "transcript",
      name: "Transcript upload",
      status: "connected" as const,
      detail: "Walkthrough audio → demo transcription on jobs.",
    },
  ],
  exploring: [
    { id: "qbo", name: "QuickBooks", category: "Accounting" },
    { id: "xero", name: "Xero", category: "Accounting" },
    { id: "fulcrum", name: "Fulcrum", category: "Shop ERP" },
    { id: "jobboss", name: "JobBOSS", category: "Shop ERP" },
    { id: "storage", name: "File storage (SharePoint / Drive)", category: "Files" },
  ],
};

export function getAdminShop(shopId: string) {
  return DEMO_ADMIN_SHOPS.find((s) => s.id === shopId) ?? null;
}

export function shopIdForSessionOrg(org: string) {
  if (org === "Northridge Steel") return "northridge";
  return null;
}
