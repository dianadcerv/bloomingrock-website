import type { DemoJob } from "@/lib/portal/demo-data";

export type JobDocumentItem = { href: string; title: string };

/** Draft outputs listed on the global Documents page and per-job documents hub. */
export function jobDocumentItems(
  job: DemoJob,
  options?: { includeControlled?: boolean },
): JobDocumentItem[] {
  const items: JobDocumentItem[] = [
    { href: `/jobs/${job.id}/sign-off`, title: "Customer sign-off" },
    { href: `/jobs/${job.id}/agreement`, title: "Work order agreement" },
    { href: `/jobs/${job.id}/bom`, title: "Bill of materials" },
    { href: `/jobs/${job.id}/pdf`, title: "Requirements PDF" },
  ];
  if (options?.includeControlled && (job.controlledProposal || job.controlledHold)) {
    items.push({
      href: `/jobs/${job.id}/controlled`,
      title: job.controlledHold ? "Controlled job hold" : "Controlled job (proposal)",
    });
  }
  if (job.cpqHandoff && options?.includeControlled) {
    items.unshift({
      href: `/jobs/${job.id}/handoff`,
      title: "Ready for handoff (Infor CPQ)",
    });
  }
  return items;
}

export function jobDocumentsHref(jobId: string) {
  return `/jobs/${jobId}/documents`;
}

const DOCUMENT_OUTPUT_SUFFIXES = ["/sign-off", "/agreement", "/bom", "/pdf"] as const;

export function isJobDocumentsNavActive(current: string, jobId: string) {
  const hub = jobDocumentsHref(jobId);
  if (current === hub) return true;
  return DOCUMENT_OUTPUT_SUFFIXES.some((suffix) => current === `/jobs/${jobId}${suffix}`);
}
