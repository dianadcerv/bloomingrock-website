import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/portal/AdminShell";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import { NORTHRIDGE_CATEGORIES } from "@/lib/portal/admin-demo-data";

export const metadata: Metadata = { title: "Product categories" };

export default async function ShopAdminCategoriesPage() {
  const session = await requireShopAdmin();

  return (
    <AdminShell session={session} current="/admin/categories">
      <PageIntro eyebrow="Shop admin" title="Product categories">
        <p>
          Each category has a default workflow and requirements checklist. Knowledge comments feed
          suggested template adjustments (person accepts — not automatic).
        </p>
      </PageIntro>
      <ul className="portal-list">
        {NORTHRIDGE_CATEGORIES.map((cat) => (
          <li key={cat.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">
                {cat.setupAtOnboarding ? "Set up at onboarding" : "Added by shop admin (demo)"}
              </p>
              <h2>{cat.label}</h2>
              <p className="look-field__hint">{cat.defaultWorkflowSummary}</p>
            </div>
            <div className="portal-list__actions">
              {cat.pendingSuggestedCount ? (
                <StatusPill tone="assumed">{cat.pendingSuggestedCount} SUGGESTED</StatusPill>
              ) : (
                <StatusPill tone="draft">No suggestions</StatusPill>
              )}
              <Link className="btn btn--primary" href={`/admin/categories/${cat.id}`}>
                Manage
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <button className="btn btn--quiet portal-btn-quiet" type="button" disabled>
        Add category (Phase 2 demo)
      </button>
    </AdminShell>
  );
}
