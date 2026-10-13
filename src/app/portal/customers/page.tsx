import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { DEMO_CUSTOMER } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const session = await requireRole("shop");

  return (
    <PortalShell session={session} current="/customers">
      <PageIntro eyebrow="CRM (Phase 1 manual)" title="Customers">
        <p>
          Customer records are created by hand in Phase 1. The app only suggests matches in
          the inbox.
        </p>
      </PageIntro>
      <ul className="portal-list">
        <li className="portal-list__item">
          <div>
            <h2>{DEMO_CUSTOMER.name}</h2>
            <p>
              {DEMO_CUSTOMER.contact} · {DEMO_CUSTOMER.email}
            </p>
          </div>
          <Link className="btn btn--primary" href={`/customers/${DEMO_CUSTOMER.id}`}>
            Open customer
          </Link>
        </li>
      </ul>
    </PortalShell>
  );
}
