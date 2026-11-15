import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { getCustomer, getProject, projectRollup } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Customer" };

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const session = await requireSession();
  const { customerId } = await params;
  const customer = getCustomer(customerId);
  if (!customer) notFound();

  const projects = customer.projectIds
    .map((id) => getProject(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProject>>[];

  return (
    <PortalShell session={session} current="/customers">
      <nav className="portal-breadcrumb" aria-label="Customers">
        <Link href="/customers">Customers</Link>
        <span aria-hidden="true">/</span>
        <span>{customer.name}</span>
      </nav>
      <PageIntro eyebrow="Customer" title={customer.name}>
        <p>
          {customer.contact} · {customer.email}
        </p>
      </PageIntro>
      <section className="portal-section">
        <h2>Projects</h2>
        <ul className="portal-list">
          {projects.map((project) => (
            <li key={project.id} className="portal-list__item">
              <div>
                <h2>{project.name}</h2>
                <p>{project.site}</p>
                <p className="portal-list__meta">Roll-up: {projectRollup(project.jobIds)}</p>
              </div>
              <div className="portal-list__actions">
                <StatusPill tone="draft">Status only · no prices</StatusPill>
                <Link
                  className="btn btn--primary"
                  href={`/customers/${customerId}/projects/${project.id}`}
                >
                  Open project
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PortalShell>
  );
}
