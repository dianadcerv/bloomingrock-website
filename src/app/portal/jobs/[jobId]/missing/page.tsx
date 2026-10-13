import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJobForShop } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Missing info" };

export default async function MissingInfoPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJobForShop(jobId);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/missing`} />
      <DraftNotice>DRAFT, NOT SENT — a person always sends.</DraftNotice>
      {job.questions.map((question) => (
        <article key={question.id} className="portal-letter">
          <h2>{question.prompt}</h2>
          <pre>{question.draft}</pre>
          <button className="btn btn--primary" type="button" disabled>
            Send (disabled in demo)
          </button>
        </article>
      ))}
    </PortalShell>
  );
}
