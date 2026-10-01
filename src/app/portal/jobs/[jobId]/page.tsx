import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { PortalShell } from "@/components/portal/PortalShell";
import { StatusPill } from "@/components/portal/PortalUi";
import { requireSession } from "@/lib/portal/auth";
import {
  checkStatusLabel,
  getJob,
  getSource,
  type CheckStatus,
} from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Job workspace" };

function checkTone(status: CheckStatus) {
  if (status === "conflict") return "conflict" as const;
  if (status === "missing") return "missing" as const;
  if (status === "assumed") return "assumed" as const;
  return "ok" as const;
}

export default async function JobWorkspacePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireSession();
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}`} role={session.role} />

      <section className="portal-section">
        <h2>Sources</h2>
        <ul className="portal-plain">
          {job.sources.map((source) => (
            <li key={source.id}>
              <strong>{source.title}</strong>
              <span>
                {" "}
                · {source.kind} · {source.from}
              </span>
              <p>{source.summary}</p>
            </li>
          ))}
        </ul>
        {session.role === "shop" ? (
          <p>
            <Link href={`/jobs/${job.id}/sources`}>Add a source</Link>
          </p>
        ) : null}
      </section>

      <section className="portal-section">
        <h2>Requirements checklist</h2>
        <ul className="portal-plain">
          {job.checklist.map((item) => (
            <li key={item.id} className="portal-check">
              <StatusPill tone={checkTone(item.status)}>
                {checkStatusLabel(item.status)}
              </StatusPill>
              <div>
                <strong>{item.label}</strong>
                {item.note ? <p>{item.note}</p> : null}
                <p className="look-field__hint">
                  Sources:{" "}
                  {item.sourceIds.length
                    ? item.sourceIds
                        .map((id) => getSource(job, id)?.title ?? id)
                        .join(", ")
                    : "none yet"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

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
        <h2>Open questions</h2>
        <ul className="portal-plain">
          {job.questions.map((question) => (
            <li key={question.id}>{question.prompt}</li>
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
    </PortalShell>
  );
}
