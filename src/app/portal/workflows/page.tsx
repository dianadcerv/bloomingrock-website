import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { jobsForSession } from "@/lib/portal/access";
import { requireSession } from "@/lib/portal/auth";
import { getCustomerForJob, jobStatusLabel } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Workflows" };

export default async function WorkflowsPage() {
  const session = await requireSession();
  const jobs = jobsForSession(session);

  return (
    <PortalShell session={session} current="/workflows">
      <PageIntro eyebrow="Visual workflow" title="Workflows">
        <p>Minimum, ideal, and added steps per job{session.role === "shop" ? " (all customers)" : ""}.</p>
      </PageIntro>
      <ul className="portal-list">
        {jobs.map((job) => {
          const customer = getCustomerForJob(job);
          return (
            <li key={job.id} className="portal-list__item">
              <div>
                <p className="portal-list__kicker">
                  {customer?.name ?? "Customer"} · {jobStatusLabel(job.status)}
                </p>
                <h2>{job.name}</h2>
                <p>{job.workflow.length} steps</p>
              </div>
              <Link className="btn btn--primary" href={`/jobs/${job.id}/workflow`}>
                Open
              </Link>
            </li>
          );
        })}
      </ul>
    </PortalShell>
  );
}
