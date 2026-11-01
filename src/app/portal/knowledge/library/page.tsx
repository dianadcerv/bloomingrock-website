import type { Metadata } from "next";
import Link from "next/link";
import { OpenQuestion, PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { EXPERT_KNOWLEDGE_TIPS, tipsGroupedByTag } from "@/lib/portal/expert-knowledge";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Knowledge library" };

export default async function KnowledgeLibraryPage() {
  const session = await requireShopStaff();
  const groups = tipsGroupedByTag();

  return (
    <PortalShell session={session} current="/knowledge/library">
      <PageIntro eyebrow="Expert knowledge" title="Knowledge library">
        <p>
          Fake tips by tag. Internal only — customer logins do not see this library. Tips are
          suggested on other jobs; a person accepts or dismisses each one.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.knowledgeApproval}</OpenQuestion>
      <section className="portal-section">
        <h2>Project categories</h2>
        <p className="look-field__hint">
          Workflow comments collect as SUGGESTED template adjustments per category. Accepting a
          suggestion does not change live jobs — template editing is Phase 2.
        </p>
        <ul className="portal-inline-actions">
          <Link className="btn btn--primary" href="/knowledge/categories/access-platforms">
            Access platforms
          </Link>
          <Link className="btn btn--quiet portal-btn-quiet" href="/knowledge/categories/exterior-stairs">
            Exterior stairs
          </Link>
        </ul>
      </section>
      <p className="look-field__hint">
        {EXPERT_KNOWLEDGE_TIPS.length} tips in demo data. Add more from any job&apos;s{" "}
        <Link href="/jobs/access-platform/knowledge">Knowledge</Link> tab.
      </p>
      {groups.map(([tag, tips]) => (
        <section key={tag} className="portal-section">
          <h2>
            <span className="portal-knowledge-tag">{tag}</span>
          </h2>
          <ul className="portal-list">
            {tips.map((tip) => (
              <li key={`${tag}-${tip.id}`} className="portal-list__item">
                <div>
                  <p className="portal-list__kicker">
                    {tip.originJobName} · {tip.createdBy} · {tip.createdAt}
                  </p>
                  <p>{tip.text}</p>
                  <p className="look-field__hint">{tip.sourceNote}</p>
                  {tip.fileName ? (
                    <p className="look-field__hint">File: {tip.fileName}</p>
                  ) : null}
                  <details className="portal-knowledge-history">
                    <summary>Edit history</summary>
                    <ul>
                      {tip.history.map((h) => (
                        <li key={h.at + h.change}>
                          <time>{h.at}</time> — {h.who}: {h.change}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
                <Link className="btn btn--primary" href={`/jobs/${tip.originJobId}/knowledge`}>
                  Open job
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PortalShell>
  );
}
