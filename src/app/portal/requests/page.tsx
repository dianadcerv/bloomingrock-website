import type { Metadata } from "next";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { jobsForSession } from "@/lib/portal/access";
import { requireRole } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Requests" };

export default async function RequestsPage() {
  const session = await requireRole("buyer");
  const questions = jobsForSession(session).flatMap((job) =>
    job.questions
      .filter((question) => question.askedOf === "customer" && question.sent)
      .map((question) => ({ ...question, job: job.name })),
  );

  return (
    <PortalShell session={session} current="/requests">
      <PageIntro eyebrow="From Northridge Steel" title="Requests">
        <p>
          Only your company&apos;s jobs appear here. Unsent shop drafts stay internal — you only
          see questions Northridge has sent to your team.
        </p>
      </PageIntro>
      {questions.length === 0 ? (
        <p className="portal-muted">No open requests right now. Check back after Northridge sends a question.</p>
      ) : (
        <ul className="portal-list">
          {questions.map((question) => (
            <li key={question.id} className="portal-list__item">
              <div>
                <p className="portal-list__kicker">{question.job}</p>
                <h2>{question.prompt}</h2>
              </div>
              <StatusPill tone="missing">Open</StatusPill>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
