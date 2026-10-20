/** Fake expert tips — suggested only, never auto-applied. */

export type KnowledgeHistoryEntry = {
  at: string;
  who: string;
  change: string;
};

export type ExpertKnowledgeTip = {
  id: string;
  text: string;
  tags: string[];
  sourceNote: string;
  createdBy: string;
  createdAt: string;
  originJobId: string;
  originJobName: string;
  attachedStepId?: string;
  fileName?: string;
  history: KnowledgeHistoryEntry[];
  /** When set, accepting adds this workflow step label on the target job. */
  suggestStepLabel?: string;
  /** When set, accepting adds this checklist line (institutional knowledge). */
  suggestChecklistLabel?: string;
};

/** Jobs that should receive each tip as a suggestion (not the origin job). */
const SUGGEST_ON: Record<string, string[]> = {
  "tip-galv-stairs": ["warehouse-b-stair", "access-platform"],
  "tip-platform-load": ["access-platform"],
  "tip-meridian-anchors": ["machine-guard", "warehouse-b-stair"],
  "tip-rail-guard": ["machine-guard"],
};

export const EXPERT_KNOWLEDGE_TIPS: ExpertKnowledgeTip[] = [
  {
    id: "tip-galv-stairs",
    text: "Exterior stairs: always ask about galvanizing vs paint before quoting lead time.",
    tags: ["exterior-stair", "finish", "product-type"],
    sourceNote: "Captured after Harborview walkthrough — customer assumed HDG.",
    createdBy: "Maya Chen",
    createdAt: "2026-10-07 16:00 CT",
    originJobId: "warehouse-b-stair",
    originJobName: "Exterior steel stair",
    history: [
      {
        at: "2026-10-07 16:00 CT",
        who: "Maya Chen",
        change: "Created tip from job walkthrough.",
      },
    ],
    suggestStepLabel: "Confirm exterior finish (galv vs paint)",
    suggestChecklistLabel: "Exterior finish: galvanize vs paint",
  },
  {
    id: "tip-platform-load",
    text: "Platforms over 6 ft need a load rating confirmed by engineering before sign-off.",
    tags: ["platform", "load-rating", "engineering"],
    sourceNote: "Northridge internal — OSHA mezzanine practice.",
    createdBy: "Maya Chen",
    createdAt: "2026-10-06 11:20 CT",
    originJobId: "machine-guard",
    originJobName: "Machine guard",
    attachedStepId: "checklist",
    history: [
      {
        at: "2026-10-06 11:20 CT",
        who: "Maya Chen",
        change: "Created and linked to engineering review step.",
      },
      {
        at: "2026-10-08 09:00 CT",
        who: "Maya Chen",
        change: "Tagged for platform jobs.",
      },
    ],
    suggestStepLabel: "Engineering load rating sign-off",
    suggestChecklistLabel: "Engineering-confirmed live load",
  },
  {
    id: "tip-meridian-anchors",
    text: "Meridian plant requires anchor drawings approved before install scheduling.",
    tags: ["meridian", "anchoring", "customer"],
    sourceNote: "From 2025 Line 2 job — facilities sent PDF markups.",
    createdBy: "Maya Chen",
    createdAt: "2026-10-05 14:45 CT",
    originJobId: "access-platform",
    originJobName: "Industrial access platform",
    fileName: "meridian-anchor-example.pdf",
    history: [
      {
        at: "2026-10-05 14:45 CT",
        who: "Maya Chen",
        change: "Created with example PDF attached.",
      },
    ],
    suggestStepLabel: "Meridian anchor drawing approval",
    suggestChecklistLabel: "Anchor drawing approved by Meridian",
  },
  {
    id: "tip-rail-guard",
    text: "Machine guards: default 42 in. rail height unless customer specifies (OSHA).",
    tags: ["guard", "rails", "product-type"],
    sourceNote: "Shop standard — still needs customer confirm on sign-off.",
    createdBy: "Maya Chen",
    createdAt: "2026-10-08 10:10 CT",
    originJobId: "machine-guard",
    originJobName: "Machine guard",
    history: [
      {
        at: "2026-10-08 10:10 CT",
        who: "Maya Chen",
        change: "Created from machine guard intake.",
      },
    ],
    suggestChecklistLabel: "Rail height confirmed (42 in. default)",
  },
];

export function getKnowledgeSuggestionsForJob(jobId: string) {
  return EXPERT_KNOWLEDGE_TIPS.filter(
    (tip) => tip.originJobId !== jobId && (SUGGEST_ON[tip.id] ?? []).includes(jobId),
  );
}

export function getExpertTip(id: string) {
  return EXPERT_KNOWLEDGE_TIPS.find((tip) => tip.id === id) ?? null;
}

export function tipsGroupedByTag() {
  const map = new Map<string, ExpertKnowledgeTip[]>();
  for (const tip of EXPERT_KNOWLEDGE_TIPS) {
    for (const tag of tip.tags) {
      const list = map.get(tag) ?? [];
      list.push(tip);
      map.set(tag, list);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}
