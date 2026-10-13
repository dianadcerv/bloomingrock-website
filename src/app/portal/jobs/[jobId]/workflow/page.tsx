import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { WorkflowEditor, WorkflowReadOnly } from "@/components/portal/WorkflowEditor";
import { WorkflowMutualPanel } from "@/components/portal/WorkflowMutualPanel";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { proposalsForJob } from "@/lib/portal/workflow-changes";

export const metadata: Metadata = { title: "Workflow" };

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);
  const shop = session.role === "shop";

  return (
    <PortalShell session={session} current="/workflows">
      <JobHeader job={job} current={`/jobs/${job.id}/workflow`} role={session.role} />
      <WorkflowMutualPanel
        jobId={job.id}
        session={session}
        initialProposals={proposalsForJob(job.id)}
      />
      {shop ? (
        <>
          <DraftNotice>FAKE DATA — drag, edit, and add steps in this demo session only.</DraftNotice>
          <WorkflowEditor
            jobId={job.id}
            jobName={job.name}
            actorName={session.name}
            initialSteps={job.workflow}
          />
        </>
      ) : (
        <>
          <p className="look-field__hint">
            Customer view: happy-path and added steps only — no internal knowledge editor.
          </p>
          <WorkflowReadOnly steps={job.workflow} />
        </>
      )}
    </PortalShell>
  );
}
