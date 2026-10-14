import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/portal/AdminShell";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { requireSuperAdmin } from "@/lib/portal/auth";
import { getAdminShop } from "@/lib/portal/admin-demo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopId: string }>;
}): Promise<Metadata> {
  const { shopId } = await params;
  const shop = getAdminShop(shopId);
  return { title: shop?.name ?? "Shop" };
}

export default async function SuperadminShopDetailPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const session = await requireSuperAdmin();
  const { shopId } = await params;
  const shop = getAdminShop(shopId);
  if (!shop) notFound();

  return (
    <AdminShell session={session} current="/admin/shops">
      <PageIntro eyebrow="Shop detail" title={shop.name}>
        <p>
          Phase: <strong>{shop.phase === "onboarding" ? "Onboarding" : "Customer Success"}</strong>
          {" · "}
          Engagement:{" "}
          <strong>
            {shop.engagement === "managed-service" ? "Managed service" : "Project-based"}
          </strong>
          {shop.engagement === "project-based" ? (
            <span className="look-field__hint"> — includes customer success hours (demo label).</span>
          ) : null}
        </p>
        {shop.engagement === "managed-service" ? (
          <OpenQuestion>BLO-29 — Managed service includes BloomingRock-led setup (consulting scope TBD).</OpenQuestion>
        ) : null}
      </PageIntro>
      <section className="portal-section">
        <h2>Onboarding checklist</h2>
        <p className="look-field__hint">
          After onboarding, the shop admin owns categories, workflows, users, branding, and
          integrations.
        </p>
        <ul className="portal-list">
          {shop.onboarding.map((step) => (
            <li key={step.id} className="portal-list__item">
              <div>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
              </div>
              <StatusPill tone={step.done ? "ok" : "draft"}>{step.done ? "Done" : "Open"}</StatusPill>
            </li>
          ))}
        </ul>
      </section>
      {shop.id === "northridge" ? (
        <p>
          <Link className="btn btn--primary" href="/admin">
            Open Northridge shop admin →
          </Link>
        </p>
      ) : null}
      <p>
        <Link href="/admin/shops">← All shops</Link>
      </p>
    </AdminShell>
  );
}
