import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { categorySuggestions } from "@/lib/portal/workflow-changes";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

const CATEGORIES: Record<string, string> = {
  "access-platforms": "Access platforms",
  "exterior-stairs": "Exterior stairs",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  return { title: CATEGORIES[categoryId] ?? "Category" };
}

export default async function KnowledgeCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await requireRole("shop");
  const { categoryId } = await params;
  const label = CATEGORIES[categoryId];
  if (!label) notFound();

  const suggestions = categorySuggestions(categoryId);

  return (
    <PortalShell session={session} current="/knowledge/library">
      <PageIntro eyebrow="Project category" title={label}>
        <p>
          Comments from workflow discussions collect here as <strong>SUGGESTED</strong> adjustments
          to the category default workflow. A person accepts them — never applied automatically.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.templateVsJobScope}</OpenQuestion>
      <ul className="portal-list">
        {suggestions.map((sug) => (
          <li key={sug.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">
                From {sug.jobName} · comment thread
              </p>
              <h2>{sug.suggestedStepLabel}</h2>
              <p>{sug.summary}</p>
            </div>
            <div className="portal-list__actions">
              <StatusPill tone="assumed">SUGGESTED</StatusPill>
              <Link className="btn btn--quiet portal-btn-quiet" href={`/jobs/${sug.jobId}/workflow`}>
                View job thread
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/knowledge/library">← Knowledge library</Link>
      </p>
    </PortalShell>
  );
}
