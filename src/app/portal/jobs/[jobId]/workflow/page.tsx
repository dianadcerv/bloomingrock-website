import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Workflow" };

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);

  return (
    <PortalShell session={session} current="/workflows">
      <JobHeader job={job} current={`/jobs/${job.id}/workflow`} role={session.role} />
      <ol className="portal-steps">
        {job.workflow.map((step) => (
          <li key={step.id} className={`portal-step portal-step--${step.kind}`}>
            <span>{step.label}</span>
            <StatusPill
              tone={
                step.kind === "added" ? "assumed" : step.done ? "ok" : "draft"
              }
            >
              {step.kind === "added"
                ? "Added"
                : step.kind === "ideal"
                  ? "Ideal"
                  : "Minimum"}
              {step.done ? " · done" : ""}
            </StatusPill>
          </li>
        ))}
      </ol>
      <p className="look-field__hint">
        Final review sits with engineering before sign-off. Added steps are
        shown in a different color.
      </p>
    </PortalShell>
  );
}
