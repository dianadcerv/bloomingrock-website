import type { Metadata } from "next";
import { CustomerDashboardHome } from "@/components/portal/CustomerDashboardHome";
import { ShopDashboardHome } from "@/components/portal/ShopDashboardHome";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { isShopStaff } from "@/lib/portal/roles";
import {
  getCustomerJobRows,
  getCustomerSummaryTiles,
  getCustomerWaitingItems,
  getRecentAuditAcrossJobs,
  getShopAttentionItems,
  getShopSummaryTiles,
  getWorkInProgressRows,
} from "@/lib/portal/dashboard-data";
import { DEMO_CUSTOMER, DEMO_PROJECT, INBOX_ITEMS } from "@/lib/portal/demo-data";
import { getDashboardNotificationsForEmail } from "@/lib/portal/workflow-changes";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const firstName = session.name.split(" ")[0];

  if (isShopStaff(session.role)) {
    const navModules = [
      {
        href: "/inbox",
        eyebrow: "Inbox",
        title: `${INBOX_ITEMS.length} to match`,
        body: "Suggested customer and job matches to confirm",
      },
      {
        href: `/customers/${DEMO_CUSTOMER.id}/projects/${DEMO_PROJECT.id}`,
        eyebrow: "Jobs / projects",
        title: DEMO_PROJECT.name,
        body: "Meridian Line 3: platform + machine guard",
      },
      {
        href: "/workflows",
        eyebrow: "Workflows",
        title: "Steps by job",
        body: "Minimum, ideal, and added steps",
      },
      {
        href: "/documents",
        eyebrow: "Sign-off / documents",
        title: "Draft outputs",
        body: "Sign-off, agreement, BOM, and PDF",
      },
    ];

    return (
      <PortalShell session={session} current="/dashboard">
        <ShopDashboardHome
          firstName={firstName}
          email={session.email}
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
        email={session.email}
        notifications={getDashboardNotificationsForEmail(session.email)}
        summaryTiles={getCustomerSummaryTiles(session)}
        waiting={getCustomerWaitingItems(session)}
        jobs={getCustomerJobRows(session)}
      />
    </PortalShell>
  );
}
