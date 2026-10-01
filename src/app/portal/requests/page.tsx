import type { Metadata } from "next";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { JOBS } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Requests" };

export default async function RequestsPage() {
  const session = await requireRole("buyer");
  const questions = JOBS.flatMap((job) =>
    job.questions
      .filter((question) => question.askedOf === "customer")
      .map((question) => ({ ...question, job: job.name })),
  );

  return (
    <PortalShell session={session} current="/requests">
      <PageIntro eyebrow="From Northridge Steel" title="Requests">
        <p>
          These questions are still drafts on the shop side. You will only see
          them here once a person sends.
        </p>
      </PageIntro>
      <ul className="portal-list">
        {questions.map((question) => (
          <li key={question.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">{question.job}</p>
              <h2>{question.prompt}</h2>
            </div>
            <StatusPill tone="draft">Not sent</StatusPill>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
