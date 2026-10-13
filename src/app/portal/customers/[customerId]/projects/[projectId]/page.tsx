import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import {
  getCustomer,
  getJob,
  getProject,
  jobStatusLabel,
  type JobStatus,
} from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Project" };

function tone(status: JobStatus) {
  if (status === "conflict") return "conflict" as const;
  if (status === "waiting-on-customer") return "missing" as const;
  return "draft" as const;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ customerId: string; projectId: string }>;
}) {
  const session = await requireSession();
  const { customerId, projectId } = await params;
  const customer = getCustomer(customerId);
  const project = getProject(projectId);
  if (!customer || !project || project.customerId !== customerId) notFound();

  const jobs = project.jobIds.map((id) => getJob(id)).filter(Boolean);

  return (
    <PortalShell session={session} current="/customers">
      <nav className="portal-breadcrumb" aria-label="Customer and project">
        <Link href="/customers">Customers</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/customers/${customerId}`}>{customer.name}</Link>
        <span aria-hidden="true">/</span>
        <span>{project.name}</span>
      </nav>
      <PageIntro eyebrow={customer.name} title={project.name}>
        <p>{project.site}</p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.statusNames}</OpenQuestion>
      <section className="portal-section">
        <h2>Jobs on this project</h2>
        <ul className="portal-list">
          {jobs.map((job) =>
            job ? (
              <li key={job.id} className="portal-list__item">
                <div>
                  <h2>{job.name}</h2>
                  <p>{job.summary}</p>
                </div>
                <div className="portal-list__actions">
                  <StatusPill tone={tone(job.status)}>{jobStatusLabel(job.status)}</StatusPill>
                  <Link className="btn btn--primary" href={`/jobs/${job.id}`}>
                    Open job workspace
                  </Link>
                </div>
              </li>
            ) : null,
          )}
        </ul>
      </section>
    </PortalShell>
  );
}
