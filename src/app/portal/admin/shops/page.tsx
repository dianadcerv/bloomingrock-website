import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/portal/AdminShell";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { requireSuperAdmin } from "@/lib/portal/auth";
import { DEMO_ADMIN_SHOPS } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Shops (superadmin)" };

function phaseLabel(phase: string) {
  return phase === "onboarding" ? "Onboarding" : "Customer Success";
}

function engagementLabel(type: string) {
  return type === "managed-service" ? "Managed service" : "Project-based";
}

export default async function SuperadminShopsPage() {
  const session = await requireSuperAdmin();

  return (
    <AdminShell session={session} current="/admin/shops">
      <PageIntro eyebrow="BloomingRock superadmin" title="Customer lifecycle">
        <p>
          Each shop shows lifecycle phase and engagement type. Fake demo data only — no billing or
          prices in this repo.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.managedServicePricing}</OpenQuestion>
      <ul className="portal-list">
        {DEMO_ADMIN_SHOPS.map((shop) => (
          <li key={shop.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">{shop.primaryContact}</p>
              <h2>{shop.name}</h2>
              <p>
                Phase: <strong>{phaseLabel(shop.phase)}</strong> · Engagement:{" "}
                <strong>{engagementLabel(shop.engagement)}</strong>
              </p>
              <p className="look-field__hint">
                {shop.onboarding.filter((s) => s.done).length}/{shop.onboarding.length} onboarding
                steps complete
              </p>
            </div>
            <div className="portal-list__actions">
              <StatusPill tone={shop.phase === "onboarding" ? "draft" : "ok"}>
                {phaseLabel(shop.phase)}
              </StatusPill>
              <Link className="btn btn--primary" href={`/admin/shops/${shop.id}`}>
                View shop
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
