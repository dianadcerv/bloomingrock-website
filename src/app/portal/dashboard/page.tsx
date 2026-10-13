import type { Metadata } from "next";
import { CustomerDashboardHome } from "@/components/portal/CustomerDashboardHome";
import { ShopDashboardHome } from "@/components/portal/ShopDashboardHome";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import {
  getCustomerJobRows,
  getCustomerSummaryTiles,
  getCustomerWaitingItems,
  getRecentAuditAcrossJobs,
  getShopAttentionItems,
  getShopSummaryTiles,
  getWorkInProgressRows,
} from "@/lib/portal/dashboard-data";
import {
  DEMO_CUSTOMER,
  DEMO_CUSTOMER_HARBORVIEW,
  DEMO_PROJECT,
  DEMO_PROJECT_WAREHOUSE_B,
  INBOX_ITEMS,
} from "@/lib/portal/demo-data";
import { getDashboardNotificationsForEmail } from "@/lib/portal/workflow-changes";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const firstName = session.name.split(" ")[0];

  if (session.role === "shop") {
    const navModules = [
      {
        href: "/inbox",
        eyebrow: "Inbox",
        title: `${INBOX_ITEMS.length} to match`,
        body: "Meridian + Harborview",
      },
      {
        href: `/customers/${DEMO_CUSTOMER.id}`,
        eyebrow: "Meridian",
        title: DEMO_PROJECT.name,
        body: "Line 3 jobs",
      },
      {
        href: `/customers/${DEMO_CUSTOMER_HARBORVIEW.id}`,
        eyebrow: "Harborview",
        title: DEMO_PROJECT_WAREHOUSE_B.name,
        body: "Warehouse B stair",
      },
      {
        href: "/knowledge/library",
        eyebrow: "Knowledge",
        title: "Expert tips",
        body: "Internal library",
      },
    ];

    return (
      <PortalShell session={session} current="/dashboard">
        <ShopDashboardHome
          firstName={firstName}
          notifications={getDashboardNotificationsForEmail(session.email)}
          summaryTiles={getShopSummaryTiles()}
          attention={getShopAttentionItems(7)}
          workJobs={getWorkInProgressRows()}
          recentActivity={getRecentAuditAcrossJobs(7)}
          navModules={navModules}
        />
      </PortalShell>
    );
  }

  return (
    <PortalShell session={session} current="/dashboard">
      <CustomerDashboardHome
        firstName={firstName}
        org={session.org}
        notifications={getDashboardNotificationsForEmail(session.email)}
        summaryTiles={getCustomerSummaryTiles(session)}
        waiting={getCustomerWaitingItems(session)}
        jobs={getCustomerJobRows(session)}
      />
    </PortalShell>
  );
}
