import Link from "next/link";
import { CustomerProjectSwitcher } from "@/components/portal/CustomerProjectSwitcher";
import { StatusPill } from "@/components/portal/PortalUi";
import {
  getCustomerForJob,
  getProjectForJob,
  jobStatusLabel,
  jobStatusPillTone,
  type DemoJob,
} from "@/lib/portal/demo-data";
import { isJobDocumentsNavActive } from "@/lib/portal/job-documents";
import { getJobSubnavLinks } from "@/lib/portal/job-nav";
import type { PortalRole } from "@/lib/portal/session";

function JobBreadcrumb({ job }: { job: DemoJob }) {
  const project = getProjectForJob(job);
  const customer = getCustomerForJob(job);
  if (!project || !customer) return null;

  return (
    <nav className="portal-breadcrumb" aria-label="Customer and project">
      <Link href="/customers">Customers</Link>
      <span aria-hidden="true">/</span>
      <Link href={`/customers/${customer.id}`}>{customer.name}</Link>
      <span aria-hidden="true">/</span>
      <Link href={`/customers/${customer.id}/projects/${project.id}`}>{project.name}</Link>
      <span aria-hidden="true">/</span>
      <span>Job</span>
    </nav>
  );
}

export function JobHeader({
  job,
  current,
  role = "shop-admin",
}: {
  job: DemoJob;
  current: string;
  role?: PortalRole;
}) {
  const project = getProjectForJob(job);
  const customer = getCustomerForJob(job);
  const links = getJobSubnavLinks(job, role);

  return (
    <div className="job-head">
      <JobBreadcrumb job={job} />
      <CustomerProjectSwitcher job={job} role={role} />
      <p className="portal-intro__eyebrow">
        {customer?.name ?? "Customer"} · {project?.name ?? "Project"}
      </p>
      <div className="job-head__title-row">
        <h1 className="portal-intro__title">{job.name}</h1>
        <StatusPill tone={jobStatusPillTone(job.status)}>{jobStatusLabel(job.status)}</StatusPill>
      </div>
      <p className="job-head__summary">{job.summary}</p>
      <nav className="job-subnav" aria-label="Job sections">
        {links.map((link) => {
          const isActive =
            current === link.href ||
            (link.label === "Documents" && isJobDocumentsNavActive(current, job.id));
          return (
            <Link key={link.href} href={link.href} className={isActive ? "is-active" : undefined}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
