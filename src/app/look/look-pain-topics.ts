/** Pain topics from question-bank v0; ids match command-center `question-bank.ts`. */
export const LOOK_PAIN_TOPICS = [
  { id: "quoting-estimating", label: "Quoting / estimating" },
  { id: "customer-follow-up", label: "Customer follow-up" },
  { id: "scheduling-capacity", label: "Scheduling and capacity" },
  { id: "inbox-email-triage", label: "Inbox and email triage" },
  { id: "reporting-status", label: "Reporting and status" },
  { id: "order-intake-paperwork", label: "Order intake and paperwork" },
  { id: "inventory-purchasing", label: "Inventory and purchasing" },
  { id: "hiring-training-knowledge", label: "Hiring, training, and knowledge" },
  { id: "invoicing-collections", label: "Invoicing and collections" },
  { id: "other-general-ops", label: "Other / general ops" },
] as const;

const ALLOWED_IDS = new Set<string>(LOOK_PAIN_TOPICS.map((topic) => topic.id));

const LABEL_BY_ID = new Map<string, string>(
  LOOK_PAIN_TOPICS.map((topic) => [topic.id, topic.label]),
);

export function parseLookPainTopics(rawValues: Iterable<FormDataEntryValue>): string[] {
  const picked: string[] = [];
  const seen = new Set<string>();

  for (const raw of rawValues) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!ALLOWED_IDS.has(trimmed) || seen.has(trimmed)) continue;
    seen.add(trimmed);
    picked.push(trimmed);
  }

  return picked;
}

export function lookPainTopicLabels(ids: string[]): string[] {
  return ids.map((id) => LABEL_BY_ID.get(id) ?? id);
}
