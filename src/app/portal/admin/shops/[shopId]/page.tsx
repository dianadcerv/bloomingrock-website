import type { Metadata } from "next";
import { AdminShell } from "@/components/portal/AdminShell";
import { SuperadminShopDetailClient } from "@/components/portal/SuperadminShopDetailClient";
import { PageIntro } from "@/components/portal/PortalUi";
import { requireSuperAdmin } from "@/lib/portal/auth";
import { getAdminShop } from "@/lib/portal/admin-demo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopId: string }>;
}): Promise<Metadata> {
  const { shopId } = await params;
  const shop = getAdminShop(shopId);
  return { title: shop?.name ?? "Customer" };
}

export default async function SuperadminShopDetailPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const session = await requireSuperAdmin();
  const { shopId } = await params;
  const seed = getAdminShop(shopId);

  return (
    <AdminShell session={session} current="/admin/shops">
      <PageIntro eyebrow="Customer detail" title={seed?.name ?? "Customer"}>
        <p className="look-field__hint">Lifecycle header below — superadmin can change phase (demo).</p>
      </PageIntro>
      <SuperadminShopDetailClient shopId={shopId} initialShop={seed} />
    </AdminShell>
  );
}
