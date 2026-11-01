import type { Metadata } from "next";
import Link from "next/link";
import { JobHeader } from "@/components/portal/JobHeader";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { getCustomerForJob } from "@/lib/portal/demo-data";
import { jobDocumentItems, jobDocumentsHref } from "@/lib/portal/job-documents";
import { isShopStaff } from "@/lib/portal/roles";

export const metadata: Metadata = { title: "Documents" };

export default async function JobDocumentsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);
  const customer = getCustomerForJob(job);
  const items = jobDocumentItems(job, { includeControlled: isShopStaff(session.role) });

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={jobDocumentsHref(job.id)} role={session.role} />
      <section className="portal-section">
        <h2>
          {customer?.name ?? "Customer"} · {job.name}
        </h2>
        <p className="look-field__hint">Drafts for this job — nothing sent in the demo.</p>
        <ul className="portal-list">
          {items.map((item) => (
            <li key={item.href} className="portal-list__item">
              <div>
                <h3>{item.title}</h3>
              </div>
              <Link className="btn btn--primary" href={item.href}>
                Open
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PortalShell>
  );
}
