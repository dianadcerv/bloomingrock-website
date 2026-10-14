import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { KnowledgeJobWorkspace } from "@/components/portal/KnowledgeJobWorkspace";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJobForShop } from "@/lib/portal/auth";
import { getKnowledgeSuggestionsForJob } from "@/lib/portal/expert-knowledge";

export const metadata: Metadata = { title: "Knowledge" };

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJobForShop(jobId);
  const suggestions = getKnowledgeSuggestionsForJob(job.id);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/knowledge`} />
      <DraftNotice>
        Internal only — customer logins cannot open this page. Knowledge is never applied
        automatically.
      </DraftNotice>
      <KnowledgeJobWorkspace
        jobId={job.id}
        jobName={job.name}
        actorName={session.name}
        workflowSteps={job.workflow}
        suggestions={suggestions}
        capturedOnJob={job.knowledge}
      />
    </PortalShell>
  );
}
