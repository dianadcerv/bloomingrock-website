import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { PrintButton } from "@/components/portal/PrintButton";
import { DraftNotice, OpenQuestion } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import {
  DEMO_SHOP,
  getCustomerForJob,
  getProjectForJob,
} from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "PDF preview" };

export default async function PdfPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);
  const customer = getCustomerForJob(job);
  const project = getProjectForJob(job);

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/pdf`} role={session.role} />
      <DraftNotice>Drafted email, not sent. Printable preview below.</DraftNotice>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.pdfContents}</OpenQuestion>
      <p className="portal-inline-actions">
        <PrintButton label="Print PDF preview" />
      </p>
      <article className="portal-letter portal-shop-doc">
        <p className="portal-shop-doc__name">{DEMO_SHOP.legal}</p>
        <h2>
          {customer?.name ?? "Customer"} — {project?.name ?? "Project"} — {job.name}
        </h2>
        <p>
          Requirements summary for review. Conflicts and missing items are listed. No prices.
        </p>
        <ul>
          {job.checklist.map((item) => (
            <li key={item.id}>
              {item.label}: {item.value ?? item.status}
              {item.note ? ` (${item.note})` : ""}
            </li>
          ))}
        </ul>
      </article>
      <div className="portal-letter">
        <p className="look-field__hint">Drafted email</p>
        <pre>
          {`Hi ${customer?.contact?.split(" ")[0] ?? "there"} — attached is a requirements PDF for the ${job.name}. Please review the open items. Nothing in this message is a quote.`}
        </pre>
        <button className="btn btn--primary" type="button" disabled>
          Send (disabled in demo)
        </button>
      </div>
    </PortalShell>
  );
}
