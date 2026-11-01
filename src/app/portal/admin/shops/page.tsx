import type { Metadata } from "next";
import { AdminShell } from "@/components/portal/AdminShell";
import { SuperadminShopsClient } from "@/components/portal/SuperadminShopsClient";
import { OpenQuestion, PageIntro } from "@/components/portal/PortalUi";
import { requireSuperAdmin } from "@/lib/portal/auth";
import { DEMO_ADMIN_SHOPS } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Customers (superadmin)" };

export default async function SuperadminShopsPage() {
  const session = await requireSuperAdmin();

  return (
    <AdminShell session={session} current="/admin/shops">
      <PageIntro eyebrow="BloomingRock superadmin" title="Customers">
        <p>
          Plan (Managed or Project-based) is billing/delivery — not the same as lifecycle phase.
          Fake demo data only; no prices.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.managedServicePricing}</OpenQuestion>
      <SuperadminShopsClient initialShops={DEMO_ADMIN_SHOPS} />
    </AdminShell>
  );
}
