import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { PrintButton } from "@/components/portal/PrintButton";
import { DraftNotice, OpenQuestion } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { DEMO_CUSTOMER, DEMO_PROJECT, DEMO_SHOP, getJob } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Work order" };

export default async function AgreementPage({
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
      <JobHeader job={job} current={`/jobs/${job.id}/agreement`} role={session.role} />
      <DraftNotice>PLACEHOLDER body in the shop&apos;s branding. No contract terms.</DraftNotice>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.workOrderWho}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.customerSignsWorkOrder}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.workOrderContents}</OpenQuestion>
      <p className="portal-inline-actions">
        <PrintButton label="Print work order" />
      </p>
      <article
        className="portal-shop-doc"
        style={{ borderTop: `4px solid ${DEMO_SHOP.brandColor}` }}
      >
        <p className="portal-shop-doc__name">{DEMO_SHOP.legal}</p>
        <h2>Work order agreement</h2>
        <p>
          {DEMO_CUSTOMER.name} · {DEMO_PROJECT.name} · {job.name}
        </p>
        <p>
          PLACEHOLDER — no invented terms or legal language. Real layout waits on a shop example
          (W5.3). No prices in Phase 1.
        </p>
        <ul>
          {job.checklist.map((item) => (
            <li key={item.id}>
              {item.label}: {item.value ?? item.status}
            </li>
          ))}
        </ul>
      </article>
    </PortalShell>
  );
}
