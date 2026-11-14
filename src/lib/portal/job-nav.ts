import type { DemoJob } from "@/lib/portal/demo-data";
import { jobDocumentsHref } from "@/lib/portal/job-documents";
import type { PortalRole } from "@/lib/portal/session";
import { isShopStaff } from "@/lib/portal/roles";

export type JobSubnavLink = { href: string; label: string };

export function getJobSubnavLinks(job: DemoJob, role: PortalRole): JobSubnavLink[] {
  const links: JobSubnavLink[] = [{ href: `/jobs/${job.id}`, label: "Workspace" }];

  if (role !== "buyer") {
    links.push(
      { href: `/jobs/${job.id}/sources`, label: "Sources" },
      { href: `/jobs/${job.id}/workflow`, label: "Workflow" },
      { href: `/jobs/${job.id}/missing`, label: "Missing info" },
      { href: `/jobs/${job.id}/knowledge`, label: "Knowledge" },
      { href: `/jobs/${job.id}/audit`, label: "Audit" },
    );
    if (isShopStaff(role) && (job.controlledProposal || job.controlledHold)) {
      links.push({ href: `/jobs/${job.id}/controlled`, label: "Controlled" });
    }
  } else {
    links.push({ href: `/jobs/${job.id}/workflow`, label: "Workflow" });
  }

  if (role !== "buyer" && job.cpqHandoff) {
    links.push({ href: `/jobs/${job.id}/handoff`, label: "Handoff" });
  }

  links.push({ href: jobDocumentsHref(job.id), label: "Documents" });
  return links;
}
