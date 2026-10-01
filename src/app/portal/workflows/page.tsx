import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { JOBS } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Workflows" };

export default async function WorkflowsPage() {
  const session = await requireRole("shop");

  return (
    <PortalShell session={session} current="/workflows">
      <PageIntro eyebrow="Visual workflow" title="Workflows">
        <p>
          Minimum steps, ideal steps, and added steps. Open a job to walk the
          sequence before engineering approval.
        </p>
      </PageIntro>
      <ul className="portal-list">
        {JOBS.map((job) => {
          const remaining = job.workflow.filter((step) => !step.done).length;
          const added = job.workflow.filter((step) => step.kind === "added").length;
          return (
            <li key={job.id} className="portal-list__item">
              <div>
                <h2>{job.name}</h2>
                <p>
                  {remaining} steps still open
                  {added ? ` · ${added} added in a different color` : ""}
                </p>
              </div>
              <div className="portal-list__actions">
                <StatusPill tone={added ? "assumed" : "draft"}>
                  {job.workflow.length} steps
                </StatusPill>
                <Link className="btn btn--primary" href={`/jobs/${job.id}/workflow`}>
                  Open workflow
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </PortalShell>
  );
}
