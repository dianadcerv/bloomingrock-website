import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/portal/AdminShell";
import { ModuleCard, OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import {
  DEMO_ADMIN_SHOPS,
  NORTHRIDGE_CATEGORIES,
  NORTHRIDGE_EMPLOYEES,
} from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Shop admin" };

export default async function ShopAdminHomePage() {
  const session = await requireShopAdmin();
  const shop = DEMO_ADMIN_SHOPS.find((s) => s.id === "northridge")!;

  return (
    <AdminShell session={session} current="/admin">
      <PageIntro eyebrow={session.org} title="Shop admin home">
        <p>
          Configure people, categories, branding, and integrations for your shop. Job intake screens
          stay under <Link href="/dashboard">Home</Link>.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.shopUserTypePermissions}</OpenQuestion>
      <div className="portal-dashboard-metrics">
        <ModuleCard
          href="/admin/users"
          eyebrow="People"
          title={`${NORTHRIDGE_EMPLOYEES.length} in demo`}
          body="Add/remove employees and assign Estimator, Engineer, Sales, or Materials types."
        />
        <ModuleCard
          href="/admin/categories"
          eyebrow="Categories"
          title={`${NORTHRIDGE_CATEGORIES.length} listed`}
          body="Access platforms set up at onboarding; add more anytime."
        />
        <ModuleCard
          href="/admin/branding"
          eyebrow="Branding"
          title="Logo + colors"
          body="Or inherit from website URL (demo mock)."
        />
        <ModuleCard
          href="/admin/integrations"
          eyebrow="Integrations"
          title="Email + transcript"
          body="Gmail / M365 and ERP placeholders."
        />
      </div>
      <section className="portal-section">
        <h2>Onboarding status (Northridge)</h2>
        <p className="look-field__hint">
          Phase: Customer Success · Engagement: Project-based (demo).
        </p>
        <ul className="portal-plain">
          {shop.onboarding.map((step) => (
            <li key={step.id}>
              {step.label} — <StatusPill tone={step.done ? "ok" : "draft"}>{step.done ? "Done" : "Open"}</StatusPill>
            </li>
          ))}
        </ul>
      </section>
      <section className="portal-section">
        <h2>Knowledge workflow suggestions</h2>
        <p>
          Approve category-level suggested steps from job comments on{" "}
          <Link href="/knowledge/categories/access-platforms">Access platforms</Link> (Phase 2 ties
          here; template edit not functional).
        </p>
        <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.templateVsJobScope}</OpenQuestion>
      </section>
    </AdminShell>
  );
}
