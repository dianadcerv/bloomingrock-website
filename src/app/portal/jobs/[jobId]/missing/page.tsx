import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { getJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Missing info" };

export default async function MissingInfoPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireRole("shop");
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

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
