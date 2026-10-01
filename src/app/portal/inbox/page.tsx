import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { INBOX_ITEMS } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const session = await requireRole("shop");

  return (
    <PortalShell session={session} current="/inbox">
      <PageIntro eyebrow="Shop home" title="Inbox">
        <p>
          Suggested customer and job matches. A person confirms before anything
          is filed.
        </p>
      </PageIntro>
      <ul className="portal-list">
        {INBOX_ITEMS.map((item) => (
          <li key={item.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">{item.from}</p>
              <h2>{item.subject}</h2>
              <p>{item.snippet}</p>
              <p className="portal-list__meta">
                Suggested: {item.suggested.customer} → {item.suggested.job}
              </p>
            </div>
            <div className="portal-list__actions">
              <StatusPill tone="draft">Needs confirm</StatusPill>
              <Link className="btn btn--primary" href={`/jobs/${item.suggested.jobId}`}>
                Confirm match
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
