import type { DemoShopRecord, ShopEngagementType, ShopLifecyclePhase } from "./admin-demo-data";
import { DEMO_ADMIN_SHOPS } from "./admin-demo-data";

export const ADMIN_SHOPS_STORAGE_KEY = "portal-admin-shops-v1";
export const ADMIN_SHOPS_UPDATED_EVENT = "portal-admin-shops-updated";

export function planLabel(engagement: ShopEngagementType) {
  return engagement === "managed-service" ? "Managed" : "Project-based";
}

export function phaseLabel(phase: ShopLifecyclePhase) {
  if (phase === "onboarding") return "Onboarding";
  if (phase === "build-out") return "Build-out";
  return "Ongoing Success";
}

export const LIFECYCLE_STEPS: { id: ShopLifecyclePhase; label: string; hint: string }[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    hint: "First customer, first project, first product the shop builds.",
  },
  {
    id: "build-out",
    label: "Build-out",
    hint: "BloomingRock helps add products, workflows, and maintenance setup.",
  },
  {
    id: "ongoing-success",
    label: "Ongoing Success",
    hint: "Proactive check-ins, relationship, learning activities.",
  },
];

export function readStoredShops(): DemoShopRecord[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SHOPS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoShopRecord[];
  } catch {
    return null;
  }
}

export function writeStoredShops(shops: DemoShopRecord[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_SHOPS_STORAGE_KEY, JSON.stringify(shops));
  window.dispatchEvent(new Event(ADMIN_SHOPS_UPDATED_EVENT));
}

export function getMergedShops(): DemoShopRecord[] {
  return readStoredShops() ?? DEMO_ADMIN_SHOPS.map((s) => ({ ...s }));
}

export function getMergedShop(shopId: string): DemoShopRecord | null {
  return getMergedShops().find((s) => s.id === shopId) ?? null;
}

export function slugifyShopName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function defaultOnboardingSteps() {
  return [
    {
      id: "wf",
      label: "Design default workflow at first meeting",
      done: false,
      detail: "Agree happy path + ideal steps for first product category.",
    },
    {
      id: "cat",
      label: "Set up at least one product category + workflow",
      done: false,
      detail: "Category template + checklist for the product they build.",
    },
    {
      id: "brand",
      label: "Branding setup",
      done: false,
      detail: "Logo/colors or inherit from website (demo).",
    },
    {
      id: "users",
      label: "Add initial users",
      done: false,
      detail: "Shop admin + first estimators/engineers.",
    },
  ];
}

export function createShopRecord(input: {
  name: string;
  engagement: ShopEngagementType;
  phase?: ShopLifecyclePhase;
}): DemoShopRecord {
  const base = slugifyShopName(input.name) || `shop-${Date.now()}`;
  const id = `${base}-${Date.now().toString(36).slice(-4)}`;
  return {
    id,
    name: input.name.trim(),
    engagement: input.engagement,
    phase: input.phase ?? "onboarding",
    primaryContact: "Not assigned",
    exitCriteria: {
      workflowSetUp: false,
      firstProjectSuccess: false,
    },
    onboarding: defaultOnboardingSteps(),
  };
}

export function canLeaveOnboarding(shop: DemoShopRecord) {
  return shop.exitCriteria.workflowSetUp && shop.exitCriteria.firstProjectSuccess;
}

/** Allowed superadmin phase moves (demo rules). */
export function allowedNextPhases(current: ShopLifecyclePhase): ShopLifecyclePhase[] {
  if (current === "onboarding") {
    return ["build-out", "ongoing-success"];
  }
  if (current === "build-out") {
    return ["ongoing-success", "onboarding"];
  }
  return ["build-out", "onboarding"];
}
