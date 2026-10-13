import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import {
  DEMO_CUSTOMER,
  DEMO_PROJECT,
  JOBS,
  jobStatusLabel,
} from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Jobs" };

function tone(status: (typeof JOBS)[number]["status"]) {
  if (status === "conflict") return "conflict" as const;
  if (status === "waiting-on-customer") return "missing" as const;
  return "draft" as const;
}

export default async function JobsPage() {
  const session = await requireSession();

  return (
    <PortalShell session={session} current="/jobs">
      <nav className="portal-breadcrumb" aria-label="Customer and project">
        <Link href="/customers">Customers</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/customers/${DEMO_CUSTOMER.id}`}>{DEMO_CUSTOMER.name}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/customers/${DEMO_CUSTOMER.id}/projects/${DEMO_PROJECT.id}`}>
          {DEMO_PROJECT.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span>Jobs</span>
      </nav>
      <PageIntro eyebrow={DEMO_CUSTOMER.name} title={DEMO_PROJECT.name}>
        <p>
          {DEMO_PROJECT.site}. Two jobs on this project. Status only — no prices
          in this phase.
        </p>
      </PageIntro>
      <ul className="portal-list">
        {JOBS.map((job) => (
          <li key={job.id} className="portal-list__item">
            <div>
              <h2>{job.name}</h2>
              <p>{job.summary}</p>
            </div>
            <div className="portal-list__actions">
              <StatusPill tone={tone(job.status)}>
                {jobStatusLabel(job.status)}
              </StatusPill>
              <Link className="btn btn--primary" href={`/jobs/${job.id}`}>
                Open workspace
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
