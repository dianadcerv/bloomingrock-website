import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { inboxItemsByCustomer } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const session = await requireShopStaff();
  const groups = inboxItemsByCustomer();

  return (
    <PortalShell session={session} current="/inbox">
      <PageIntro eyebrow="Shop home" title="Inbox">
        <p>
          Grouped by suggested customer. Confirm, reassign, or forward before anything is
          filed.
        </p>
      </PageIntro>
      {groups.map(({ customer, items }) => (
        <section key={customer.id} className="portal-inbox-group">
          <h2>{customer.name}</h2>
          <ul className="portal-list">
            {items.map((item) => (
              <li key={item.id} className="portal-list__item">
                <div>
                  <p className="portal-list__kicker">{item.from}</p>
                  <h3>{item.subject}</h3>
                  <p>{item.snippet}</p>
                  <p className="portal-list__meta">
                    Suggested: {item.suggested.project} → {item.suggested.jobs.join(" + ")}
                  </p>
                </div>
                <div className="portal-list__actions">
                  <StatusPill tone="draft">Needs confirm</StatusPill>
                  <Link className="btn btn--primary" href={`/inbox/${item.id}`}>
                    Review match
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PortalShell>
  );
}
