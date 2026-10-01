import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { getJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Controlled job" };

export default async function ControlledJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireRole("shop");
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/controlled`} />
      <DraftNotice>
        Proposal only. Attorney and hosting reviews are still open (BLO-21,
        BLO-25, BLO-26). Nothing here is legal advice.
      </DraftNotice>
      <section className="portal-section">
        <h2>If this were a controlled job</h2>
        <ul className="portal-plain">
          <li>The app would flag it and refuse to process until reviews are done.</li>
          <li>Outside tools would be off.</li>
          <li>Only users marked as US persons could open it.</li>
          <li>The app would log who viewed or sent what.</li>
        </ul>
      </section>
    </PortalShell>
  );
}
