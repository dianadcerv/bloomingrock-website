import type { Metadata } from "next";
import { CustomerDashboardHome } from "@/components/portal/CustomerDashboardHome";
import { ShopDashboardHome } from "@/components/portal/ShopDashboardHome";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { isShopStaff } from "@/lib/portal/roles";
import {
  customerFilterOptions,
  getCustomerJobRows,
  getCustomerSummaryTiles,
  getCustomerWaitingItems,
  getRecentAuditAcrossJobs,
  getShopAttentionItems,
  getShopNavModules,
  getShopSummaryTiles,
  getWorkInProgressRows,
} from "@/lib/portal/dashboard-data";
import { getDashboardNotificationsForEmail } from "@/lib/portal/workflow-changes";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const firstName = session.name.split(" ")[0];

  if (isShopStaff(session.role)) {
    return (
      <PortalShell session={session} current="/dashboard">
        <ShopDashboardHome
          firstName={firstName}
          email={session.email}
          notifications={getDashboardNotificationsForEmail(session.email)}
          summaryTiles={getShopSummaryTiles(session)}
          attention={getShopAttentionItems(session, 7)}
          workJobs={getWorkInProgressRows(session)}
          recentActivity={getRecentAuditAcrossJobs(session, 7)}
          navModules={getShopNavModules(session)}
          customerFilterOptions={customerFilterOptions(session)}
        />
      </PortalShell>
    );
  }

  return (
    <PortalShell session={session} current="/dashboard">
      <CustomerDashboardHome
        firstName={firstName}
        org={session.org}
        email={session.email}
        notifications={getDashboardNotificationsForEmail(session.email)}
        summaryTiles={getCustomerSummaryTiles(session)}
        waiting={getCustomerWaitingItems(session)}
        jobs={getCustomerJobRows(session)}
      />
    </PortalShell>
  );
}
