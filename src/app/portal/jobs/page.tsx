import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { jobsForSession } from "@/lib/portal/access";
import { requireSession } from "@/lib/portal/auth";
import {
  DEMO_CUSTOMERS,
  DEMO_PROJECTS,
  getJob,
  jobStatusLabel,
  type JobStatus,
} from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Jobs" };

function tone(status: JobStatus) {
  if (status === "conflict") return "conflict" as const;
  if (status === "waiting-on-customer") return "missing" as const;
  if (status === "ready-for-signoff" || status === "signed") return "ok" as const;
  return "draft" as const;
}

export default async function JobsPage() {
  const session = await requireSession();
  const visibleJobs = jobsForSession(session);

  if (session.role === "buyer") {
    const customer = DEMO_CUSTOMERS.find((c) => c.email === session.email.toLowerCase());
    return (
      <PortalShell session={session} current="/jobs">
        <PageIntro eyebrow={session.org} title="Your jobs">
          <p>Only jobs for {customer?.name ?? "your company"} appear here.</p>
        </PageIntro>
        <ul className="portal-list">
          {visibleJobs.map((job) => (
            <li key={job.id} className="portal-list__item">
              <div>
                <h2>{job.name}</h2>
                <p>{job.summary}</p>
              </div>
              <div className="portal-list__actions">
                <StatusPill tone={tone(job.status)}>{jobStatusLabel(job.status)}</StatusPill>
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

  const byCustomer = DEMO_CUSTOMERS.map((customer) => ({
    customer,
    projects: DEMO_PROJECTS.filter((p) => p.customerId === customer.id),
  }));

  return (
    <PortalShell session={session} current="/jobs">
      <PageIntro eyebrow="All customers" title="Jobs by customer">
        <p>
          Grouped by customer and project. Meridian Line 3 is in conflict; Harborview stair is
          ready for sign-off — status only, no prices.
        </p>
      </PageIntro>
      {byCustomer.map(({ customer, projects }) => (
        <section key={customer.id} className="portal-jobs-group">
          <h2>
            <Link href={`/customers/${customer.id}`}>{customer.name}</Link>
          </h2>
          {projects.map((project) => {
            const jobs = project.jobIds.map((id) => getJob(id)).filter(Boolean);
            return (
              <div key={project.id} className="portal-section">
                <h3>
                  <Link href={`/customers/${customer.id}/projects/${project.id}`}>
                    {project.name}
                  </Link>
                </h3>
                <p className="look-field__hint">{project.site}</p>
                <ul className="portal-list">
                  {jobs.map((job) =>
                    job ? (
                      <li key={job.id} className="portal-list__item">
                        <div>
                          <h4>{job.name}</h4>
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
                    ) : null,
                  )}
                </ul>
              </div>
            );
          })}
        </section>
      ))}
    </PortalShell>
  );
}
