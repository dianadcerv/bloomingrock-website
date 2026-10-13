import type { Metadata } from "next";
import Link from "next/link";
import { JobHeader } from "@/components/portal/JobHeader";
import { OpenQuestion, StatusPill, SuggestionBadge } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import {
  checkStatusLabel,
  getSource,
  type CheckStatus,
} from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

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
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}`} role={session.role} />

      <section className="portal-section">
        <h2>Sources (reading order)</h2>
        <ul className="portal-plain">
          {job.sources.map((source) => (
            <li key={source.id}>
              <strong>{source.title}</strong>
              <span>
                {" "}
                · {source.kind} · {source.from}
              </span>
              <p>{source.summary}</p>
              {source.quote ? (
                <p className="look-field__hint">Quoted: “{source.quote}”</p>
              ) : null}
              {source.readByApp === false ? (
                <p className="look-field__hint">Stored only — not read in this demo.</p>
              ) : source.status === "needs-review" ? (
                <SuggestionBadge />
              ) : null}
            </li>
          ))}
        </ul>
        {session.role === "shop" ? (
          <p>
            <Link href={`/jobs/${job.id}/sources`}>Add a source</Link>
            {" · "}
            <Link href={`/jobs/${job.id}/transcript`}>Transcript / recording upload</Link>
          </p>
        ) : null}
      </section>

      <section className="portal-section">
        <h2>Requirements checklist</h2>
        <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.statusNames}</OpenQuestion>
        <ul className="portal-plain">
          {job.checklist.map((item) => (
            <li key={item.id} className="portal-check">
              <StatusPill tone={checkTone(item.status)}>
                {checkStatusLabel(item.status)}
              </StatusPill>
              <div>
                <strong>{item.label}</strong>
                {item.value ? <p>Value (suggested): {item.value}</p> : null}
                {item.reviewState === "needs-review" ? <SuggestionBadge /> : null}
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
