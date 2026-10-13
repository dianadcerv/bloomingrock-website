import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { DEMO_CUSTOMERS, getProject, projectRollup } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const session = await requireRole("shop");

  return (
    <PortalShell session={session} current="/customers">
      <PageIntro eyebrow="CRM (Phase 1 manual)" title="Customers">
        <p>
          Two fake customers in this demo. Pick one to open projects and jobs. Records are
          created by hand in Phase 1; the inbox only suggests matches.
        </p>
      </PageIntro>
      <ul className="portal-list">
        {DEMO_CUSTOMERS.map((customer) => {
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
