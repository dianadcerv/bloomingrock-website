import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { customersForSession } from "@/lib/portal/access";
import { getProject, projectRollup } from "@/lib/portal/demo-data";
import { shopIdForSession } from "@/lib/portal/demo-shop";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const session = await requireShopStaff();
  const customers = customersForSession(session);
  const heaterDemo = shopIdForSession(session) === "heaterco";

  return (
    <PortalShell session={session} current="/customers">
      <PageIntro eyebrow="CRM (Phase 1 manual)" title="Customers">
        <p>
          {heaterDemo
            ? "Demo customer for the heater RFQ story. CRM record is not duplicated when you hand off to CPQ."
            : "Fake customers for this shop demo. Pick one to open projects and jobs. Records are created by hand in Phase 1; the inbox only suggests matches."}
        </p>
      </PageIntro>
      <ul className="portal-list">
        {customers.map((customer) => {
          const projects = customer.projectIds
            .map((id) => getProject(id))
            .filter(Boolean);
          return (
            <li key={customer.id} className="portal-list__item">
              <div>
                <h2>{customer.name}</h2>
                <p>
                  {customer.contact} · {customer.email}
                </p>
                <p className="portal-list__meta">
                  {projects.map((p) => (p ? `${p.name}: ${projectRollup(p.jobIds)}` : "")).join(" · ")}
                </p>
              </div>
              <Link className="btn btn--primary" href={`/customers/${customer.id}`}>
                Open customer
              </Link>
            </li>
          );
        })}
      </ul>
    </PortalShell>
  );
}
