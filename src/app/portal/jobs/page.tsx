import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { jobsForSession } from "@/lib/portal/access";
import { requireSession } from "@/lib/portal/auth";
import {
  DEMO_CUSTOMERS,
  DEMO_PROJECTS,
  getCustomerForJob,
  getJob,
  getProjectForJob,
  jobStatusLabel,
  jobStatusPillTone,
  type DemoJob,
  type JobStatus,
} from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Jobs" };

type SearchParams = Promise<{
  status?: string;
  filter?: string;
  customer?: string;
}>;

function jobMatchesFilter(job: DemoJob, filter: string | undefined) {
  if (!filter) return true;
  if (filter === "needs-review") {
    return job.checklist.some((c) => c.reviewState === "needs-review");
  }
  if (filter === "drafts") {
    return job.questions.length > 0;
  }
  return true;
}

function jobMatchesStatus(job: DemoJob, status: string | undefined) {
  if (!status) return true;
  if (status === "conflict") {
    return job.status === "conflict" || job.conflicts.length > 0;
  }
  return job.status === (status as JobStatus);
}

function filterTitle(status?: string, filter?: string) {
  if (status === "conflict") return "Jobs with conflicts";
  if (status === "waiting-on-customer") return "Waiting on customer";
  if (filter === "needs-review") return "Items needing review";
  if (filter === "drafts") return "Drafts ready to send";
  return "Jobs by customer";
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireSession();
  const { status, filter, customer: customerParam } = await searchParams;
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
                <StatusPill tone={jobStatusPillTone(job.status)}>
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

  const hasQuery = Boolean(status || filter);
  if (hasQuery) {
    let filtered = visibleJobs.filter(
      (job) => jobMatchesStatus(job, status) && jobMatchesFilter(job, filter),
    );
    if (customerParam) {
      filtered = filtered.filter((job) => getCustomerForJob(job)?.id === customerParam);
    }

    return (
      <PortalShell session={session} current="/jobs">
        <PageIntro eyebrow="Filtered list" title={filterTitle(status, filter)}>
          <p>
            {filtered.length} job{filtered.length === 1 ? "" : "s"} match this view.{" "}
            <Link href="/jobs">Clear filters</Link> · <Link href="/dashboard">Home</Link>
          </p>
        </PageIntro>
        <ul className="portal-list">
          {filtered.map((job) => {
            const customer = getCustomerForJob(job);
            const project = getProjectForJob(job);
            return (
              <li key={job.id} className="portal-list__item">
                <div>
                  <p className="portal-list__kicker">
                    {customer?.name} · {project?.name}
                  </p>
                  <h2>{job.name}</h2>
                  <p>{job.summary}</p>
                </div>
                <div className="portal-list__actions">
                  <StatusPill tone={jobStatusPillTone(job.status)}>
                    {jobStatusLabel(job.status)}
                  </StatusPill>
                  <Link className="btn btn--primary" href={`/jobs/${job.id}`}>
                    Open workspace
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        {!filtered.length ? <p>No jobs match this filter in the demo data.</p> : null}
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
                          <StatusPill tone={jobStatusPillTone(job.status)}>
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
