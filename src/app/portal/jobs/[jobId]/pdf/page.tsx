import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { DEMO_CUSTOMER, DEMO_PROJECT, getJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "PDF preview" };

export default async function PdfPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireSession();
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/pdf`} role={session.role} />
      <DraftNotice>Drafted email, not sent.</DraftNotice>
      <article className="portal-letter">
        <h2>
          {DEMO_CUSTOMER.name} — {DEMO_PROJECT.name} — {job.name}
        </h2>
        <p>
          Requirements summary for review. Conflicts and missing items are
          listed. No prices.
        </p>
        <ul>
          {job.checklist.map((item) => (
            <li key={item.id}>
              {item.label}: {item.status}
              {item.note ? ` (${item.note})` : ""}
            </li>
          ))}
        </ul>
      </article>
      <div className="portal-letter">
        <p className="look-field__hint">Drafted email</p>
        <pre>
          {`Hi Jordan — attached is a requirements PDF for the ${job.name}. Please review the open items. Nothing in this message is a quote.`}
        </pre>
        <button className="btn btn--primary" type="button" disabled>
          Send (disabled in demo)
        </button>
      </div>
    </PortalShell>
  );
}
