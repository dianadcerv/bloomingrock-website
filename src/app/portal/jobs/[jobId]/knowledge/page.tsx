import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { getJob, JOBS } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Knowledge" };

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireRole("shop");
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();
  const other = JOBS.find((item) => item.id !== job.id);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/knowledge`} />
      <DraftNotice>
        Saved team knowledge is only suggested on future jobs, never added
        automatically.
      </DraftNotice>
      <section className="portal-section">
        <h2>Capture from this job</h2>
        <ul className="portal-plain">
          {job.knowledge.length ? (
            job.knowledge.map((item) => <li key={item}>{item}</li>)
          ) : (
            <li>Nothing captured yet.</li>
          )}
        </ul>
      </section>
      {other ? (
        <section className="portal-section">
          <h2>Suggestion on {other.name}</h2>
          <p>
            Use the 42 in. rail-height assumption on the machine guard too?
          </p>
          <p className="portal-inline-actions">
            <button className="btn btn--primary" type="button" disabled>
              Accept (demo)
            </button>
            <button className="btn btn--ghost portal-btn-quiet" type="button" disabled>
              Skip (demo)
            </button>
            <StatusPill tone="draft">Person decides</StatusPill>
          </p>
        </section>
      ) : null}
    </PortalShell>
  );
}
