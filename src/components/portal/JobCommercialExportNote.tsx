import type { DemoJob } from "@/lib/portal/demo-data";

/** One-line note on commercial jobs: A&amp;D hold behavior stays separate. */
export function JobCommercialExportNote({ job }: { job: DemoJob }) {
  if (job.controlledHold) return null;
  if ((job.shopId ?? "northridge") !== "heaterco" && !job.cpqHandoff) return null;

  return (
    <p className="look-field__hint portal-commercial-note">
      A job flagged Aerospace and Defense would be held with its files until an export review is recorded.
      This commercial RFQ is not on hold.
    </p>
  );
}