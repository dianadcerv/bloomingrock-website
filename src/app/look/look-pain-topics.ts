/** Pain topics from question-bank v0; values match portal / post-call filtering. */
export const LOOK_PAIN_TOPICS = [
  { value: "Quoting and estimating", label: "Quoting / estimating" },
  { value: "Customer follow-up", label: "Customer follow-up" },
  { value: "Scheduling and capacity", label: "Scheduling and capacity" },
  { value: "Inbox and email triage", label: "Inbox and email triage" },
  { value: "Reporting and status", label: "Reporting and status" },
  { value: "Order intake and paperwork", label: "Order intake and paperwork" },
  { value: "Inventory and purchasing", label: "Inventory and purchasing" },
  { value: "Hiring, training, knowledge", label: "Hiring, training, and knowledge" },
  { value: "Invoicing and collections", label: "Invoicing and collections" },
  { value: "Other / general ops", label: "Other / general ops" },
] as const;

const ALLOWED = new Set<string>(LOOK_PAIN_TOPICS.map((topic) => topic.value));

export function parseLookPainTopics(rawValues: Iterable<FormDataEntryValue>): string[] {
  const picked: string[] = [];
  const seen = new Set<string>();

  for (const raw of rawValues) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!ALLOWED.has(trimmed) || seen.has(trimmed)) continue;
    seen.add(trimmed);
    picked.push(trimmed);
  }

  return picked;
}
