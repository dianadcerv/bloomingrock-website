import type { Metadata } from "next";
import { JobControlledHoldBanner } from "@/components/portal/JobControlledHoldBanner";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJobForShop } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Controlled job" };

export default async function ControlledJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJobForShop(jobId);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/controlled`} />
      <DraftNotice>Demo — audit and access rules for controlled jobs are not final.</DraftNotice>
      <JobControlledHoldBanner job={job} />
      <p>
        Open the <a href={`/jobs/${job.id}`}>job workspace</a> for sources on hold. Checklist and
        AI suggestions are intentionally empty until handling moves outside the app.
      </p>
    </PortalShell>
  );
}
