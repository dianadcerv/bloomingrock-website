import type { Metadata } from "next";
import { AdminShell } from "@/components/portal/AdminShell";
import { OpenQuestion, PageIntro } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import { SHOP_USER_TYPE_PERMISSIONS } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Permissions" };

export default async function ShopAdminPermissionsPage() {
  const session = await requireShopAdmin();

  return (
    <AdminShell session={session} current="/admin/permissions">
      <PageIntro eyebrow="Shop admin" title="Permissions by user type">
        <p>
          Estimator, Engineer, Sales, and Materials share the same permissions in this demo; labels
          are customizable names only. Customer light users keep the existing buyer experience.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.shopUserTypePermissions}</OpenQuestion>
      <div className="portal-admin-table-wrap">
        <table className="portal-admin-table">
          <thead>
            <tr>
              <th>Action / data</th>
              <th>Estimator</th>
              <th>Engineer</th>
              <th>Sales</th>
              <th>Materials</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {SHOP_USER_TYPE_PERMISSIONS.map((row) => (
              <tr key={row.action}>
                <td>{row.action}</td>
                <td>{row.estimator ? "✓" : "—"}</td>
                <td>{row.engineer ? "✓" : "—"}</td>
                <td>{row.sales ? "✓" : "—"}</td>
                <td>{row.materials ? "✓" : "—"}</td>
                <td>{row.customer ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
