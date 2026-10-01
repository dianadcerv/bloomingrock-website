import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { DEMO_CUSTOMER, DEMO_PROJECT, DEMO_SHOP, getJob } from "@/lib/portal/demo-data";

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
      <article className="portal-shop-doc">
        <p className="portal-shop-doc__name">{DEMO_SHOP.legal}</p>
        <h2>Work order agreement</h2>
        <p>
          {DEMO_CUSTOMER.name} · {DEMO_PROJECT.name} · {job.name}
        </p>
        <p>
          Body of the agreement is a placeholder. Northridge colors are used
          here only; the app chrome stays BloomingRock until Phase 3 branding.
        </p>
      </article>
    </PortalShell>
  );
}
