import type { Metadata } from "next";
import Link from "next/link";
import { JobHeader } from "@/components/portal/JobHeader";
import { ChecklistSection } from "@/components/portal/ChecklistSection";
import { SourcesSection } from "@/components/portal/SourcesSection";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { getSource } from "@/lib/portal/demo-data";

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

      <SourcesSection job={job} showShopLinks={session.role === "shop"} />

      <ChecklistSection job={job} />

      {job.conflicts.length ? (
        <section className="portal-section">
          <h2>Conflicts</h2>
          {job.conflicts.map((conflict) => (
            <div key={conflict.id} className="portal-conflict">
              <p>
                <strong>{conflict.field}</strong>
              </p>
              <p>
                {getSource(job, conflict.left.sourceId)?.title}: {conflict.left.value}
              </p>
              <p>
                {getSource(job, conflict.right.sourceId)?.title}: {conflict.right.value}
              </p>
            </div>
          ))}
        </section>
      ) : null}

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
        {session.role === "shop" ? (
          <p>
            <Link href={`/jobs/${job.id}/missing`}>Open missing-info drafts</Link>
          </p>
        ) : (
          <p>
            <Link href="/requests">See requests</Link>
          </p>
        )}
      </section>

      {session.role === "shop" ? (
        <section className="portal-section">
          <h2>Recent activity</h2>
          <ul className="portal-plain portal-audit">
            {job.auditLog.slice(0, 3).map((entry) => (
              <li key={entry.id}>
                <time dateTime={entry.at}>{entry.at}</time> — {entry.action}: {entry.detail}
              </li>
            ))}
          </ul>
          <p>
            <Link href={`/jobs/${job.id}/audit`}>Full audit log</Link>
          </p>
        </section>
      ) : null}
    </PortalShell>
  );
}
