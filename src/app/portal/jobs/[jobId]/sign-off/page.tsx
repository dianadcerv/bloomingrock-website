import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import {
  DraftNotice,
  OpenQuestion,
  StatusPill,
  SuggestionBadge,
} from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import {
  checkStatusLabel,
  DEMO_SHOP,
  getCustomerForJob,
  getProjectForJob,
  getSource,
  type CheckStatus,
} from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Sign-off" };

function checkTone(status: CheckStatus) {
  if (status === "conflict") return "conflict" as const;
  if (status === "missing") return "missing" as const;
  if (status === "assumed") return "assumed" as const;
  return "ok" as const;
}

export default async function SignOffPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);
  const buyer = session.role === "buyer";
  const customer = getCustomerForJob(job);
  const project = getProjectForJob(job);

  const assumed = job.checklist.filter((c) => c.status === "assumed");

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/sign-off`} role={session.role} />

      {buyer ? (
        <>
          <p className="portal-auth__lead">
            Secure link entry — no customer account. Enter the one-time code from your email.
          </p>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.codeEmailOutgoing}</OpenQuestion>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.linkCodeExpiry}</OpenQuestion>
          <div className="portal-letter">
            <p className="look-field__hint">Demo code (not emailed)</p>
            <p className="portal-code">482917</p>
            <label className="look-field">
              <span className="look-field__label">One-time code</span>
              <input className="look-field__input" defaultValue="482917" readOnly />
            </label>
            <button className="btn btn--primary" type="button" disabled>
              Verify code (demo)
            </button>
          </div>
        </>
      ) : (
        <DraftNotice>
          Internal view. The app drafts the link email — a person sends. Nothing is sent in this
          prototype.
        </DraftNotice>
      )}

      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.signOffPageLayout}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.missingBlocksSign}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.conflictsBlockSign}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.revisionsResign}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.changeRequestChannel}</OpenQuestion>

      <article className="portal-letter">
        <header>
          <h2>Job Requirements Sign-off</h2>
          <p>
            {customer?.name ?? "Customer"} · {project?.name ?? "Project"} · {job.name}
          </p>
          <p className="look-field__hint">
            Revision {job.revision} · {new Date().toLocaleDateString("en-US")} · {DEMO_SHOP.name}
          </p>
        </header>

        {!buyer ? (
          <>
            <p>
              Sign-off link (demo): /jobs/{job.id}/sign-off
            </p>
            <button className="btn btn--primary" type="button" disabled>
              Prepare link email (demo)
            </button>
          </>
        ) : null}

        <section className="portal-section">
          <h3>Conflicts first</h3>
          {job.conflicts.length ? (
            job.conflicts.map((conflict) => (
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
            ))
          ) : (
            <p>None on this job.</p>
          )}
        </section>

        <section className="portal-section">
          <h3>Requirements checklist</h3>
          <ul className="portal-plain">
            {job.checklist.map((item) => (
              <li key={item.id} className="portal-check">
                <StatusPill tone={checkTone(item.status)}>
                  {checkStatusLabel(item.status)}
                </StatusPill>
                <div>
                  <strong>{item.label}</strong>
                  {item.value ? <p>{item.value}</p> : null}
                  {item.reviewState === "needs-review" ? <SuggestionBadge /> : null}
                  <p className="look-field__hint">
                    Sources:{" "}
                    {item.sourceIds.length
                      ? item.sourceIds
                          .map((id) => getSource(job, id)?.title ?? id)
                          .join(", ")
                      : "—"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="portal-section">
          <h3>Assumptions</h3>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.assumptionsOnPage}</OpenQuestion>
          {assumed.length ? (
            <ul>
              {assumed.map((item) => (
                <li key={item.id}>
                  {item.label}: {item.value ?? "—"}
                </li>
              ))}
            </ul>
          ) : (
            <p>None marked as shop assumptions.</p>
          )}
        </section>

        <section className="portal-section">
          <h3>Open questions</h3>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.openQuestionsOwners}</OpenQuestion>
          <ul>
            {job.questions.map((q) => (
              <li key={q.id}>
                {q.prompt}
                {q.owner ? ` (${q.owner})` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section className="portal-section">
          <h3>Sign-offs</h3>
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.signOffLegal}</OpenQuestion>
          <p>
            Customer: {customer?.contact ?? "—"} — not signed (demo blocked by open items).
          </p>
          <p>Engineer: Maya Chen — not signed.</p>
          {buyer ? (
            <button className="btn btn--primary" type="button" disabled>
              I confirm this is correct (demo disabled)
            </button>
          ) : null}
        </section>
      </article>
    </PortalShell>
  );
}
