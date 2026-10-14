import type { Metadata } from "next";
import Link from "next/link";
import { JobChecklistClient } from "@/components/portal/JobChecklistClient";
import { JobConflictBanner } from "@/components/portal/JobConflictBanner";
import { JobHeader } from "@/components/portal/JobHeader";
import { JobRecentAuditClient } from "@/components/portal/JobRecentAuditClient";
import { SourcesSection } from "@/components/portal/SourcesSection";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { isShopStaff } from "@/lib/portal/roles";

export const metadata: Metadata = { title: "Job workspace" };

export default async function JobWorkspacePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}`} role={session.role} />
      <JobConflictBanner job={job} />

      <SourcesSection job={job} showShopLinks={isShopStaff(session.role)} />

      <JobChecklistClient job={job} who={session.name} />

      <section className="portal-section">
        <h2>Open questions (job)</h2>
        <ul className="portal-plain">
          {job.questions.map((question) => (
            <li key={question.id}>
              {question.prompt}
              {question.owner ? (
                <span className="look-field__hint"> Owner: {question.owner}</span>
              ) : null}
            </li>
          ))}
        </ul>
        {isShopStaff(session.role) ? (
          <p>
            <Link href={`/jobs/${job.id}/missing`}>Open missing-info drafts</Link>
          </p>
        ) : (
          <p>
            <Link href="/requests">See requests</Link>
          </p>
        )}
      </section>

      {isShopStaff(session.role) ? (
        <section className="portal-section">
          <h2>Recent activity</h2>
          <JobRecentAuditClient jobId={job.id} seed={job.auditLog.slice(0, 3)} />
          <p>
            <Link href={`/jobs/${job.id}/audit`}>Full audit log</Link>
          </p>
        </section>
      ) : null}
    </PortalShell>
  );
}
