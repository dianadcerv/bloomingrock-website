import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { WorkflowJobClient } from "@/components/portal/WorkflowJobClient";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { isShopStaff } from "@/lib/portal/roles";

export const metadata: Metadata = { title: "Workflow" };

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);
  const shop = isShopStaff(session.role);

  return (
    <PortalShell session={session} current="/workflows">
      <JobHeader job={job} current={`/jobs/${job.id}/workflow`} role={session.role} />
      {shop ? (
        <DraftNotice>
          FAKE DATA — mutual approval applies to add/remove; drag and edit details in this demo
          session only.
        </DraftNotice>
      ) : (
        <p className="look-field__hint">
          Propose workflow changes, approve pending steps, and comment on each step. Internal
          knowledge library is not shown to customer logins.
        </p>
      )}
      <WorkflowJobClient
        jobId={job.id}
        jobName={job.name}
        session={session}
        initialSteps={job.workflow}
      />
    </PortalShell>
  );
}
