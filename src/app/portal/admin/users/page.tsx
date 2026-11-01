import type { Metadata } from "next";
import { AdminShell } from "@/components/portal/AdminShell";
import { DraftNotice, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import { NORTHRIDGE_EMPLOYEES } from "@/lib/portal/admin-demo-data";

export const metadata: Metadata = { title: "People" };

export default async function ShopAdminUsersPage() {
  const session = await requireShopAdmin();

  return (
    <AdminShell session={session} current="/admin/users">
      <PageIntro eyebrow="Shop admin" title="People">
        <p>Add or remove employees and assign user types. Demo list only — no saves.</p>
      </PageIntro>
      <DraftNotice>FAKE DATA — buttons disabled in demo.</DraftNotice>
      <ul className="portal-list">
        {NORTHRIDGE_EMPLOYEES.map((emp) => (
          <li key={emp.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">{emp.userType}</p>
              <h2>{emp.name}</h2>
              <p>{emp.email}</p>
              <p className="look-field__hint">{emp.permissionsNote}</p>
            </div>
            <StatusPill tone="ok">Active</StatusPill>
          </li>
        ))}
      </ul>
      <button className="btn btn--primary" type="button" disabled>
        Invite employee (demo)
      </button>
    </AdminShell>
  );
}
