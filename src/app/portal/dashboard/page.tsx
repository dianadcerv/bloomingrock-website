import type { Metadata } from "next";
import { ModuleCard, PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { buyerCustomerIdForEmail } from "@/lib/portal/access";
import { requireSession } from "@/lib/portal/auth";
import {
  DEMO_CUSTOMER,
  DEMO_CUSTOMER_HARBORVIEW,
  DEMO_PROJECT,
  DEMO_PROJECT_WAREHOUSE_B,
  INBOX_ITEMS,
  getJob,
} from "@/lib/portal/demo-data";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const platform = getJob("access-platform");
  const guard = getJob("machine-guard");
  const harborStair = getJob("warehouse-b-stair");

  const meridianInbox = INBOX_ITEMS.filter((i) => i.suggested.customerId === "meridian").length;
  const harborInbox = INBOX_ITEMS.filter((i) => i.suggested.customerId === "harborview").length;

  const shopModules = [
    {
      href: "/inbox",
      eyebrow: "Inbox",
      title: `${INBOX_ITEMS.length} messages · 2 customers`,
      body: `Meridian (${meridianInbox}) and Harborview (${harborInbox}). Review matches before filing.`,
    },
    {
      href: `/customers/${DEMO_CUSTOMER.id}`,
      eyebrow: "Meridian Food Plants",
      title: DEMO_PROJECT.name,
      body: `${platform?.name}: ${platform?.status === "conflict" ? "width conflict" : "in progress"}. ${guard?.name}: waiting on customer.`,
    },
    {
      href: `/customers/${DEMO_CUSTOMER_HARBORVIEW.id}`,
      eyebrow: "Harborview Logistics",
      title: DEMO_PROJECT_WAREHOUSE_B.name,
      body: `${harborStair?.name}: ready for sign-off (different stage than Line 3 platform).`,
    },
    {
      href: "/jobs",
      eyebrow: "Jobs",
      title: "Grouped by customer",
      body: "Switch between Meridian and Harborview projects from one list.",
    },
    {
      href: "/documents",
      eyebrow: "Sign-off / documents",
      title: "Drafts only — nothing sent",
      body: "Per-job sign-off, work order, BOM, and PDF. Open from each job.",
    },
  ];

  const buyerCustomerId = buyerCustomerIdForEmail(session.email);
  const isMeridian = buyerCustomerId === DEMO_CUSTOMER.id;

  const buyerModules = isMeridian
    ? [
        {
          href: "/jobs",
          eyebrow: "Jobs",
          title: `${DEMO_PROJECT.name} at your plant`,
          body: "The access platform has an open question on width. The machine guard is waiting on size.",
        },
        {
          href: "/documents",
          eyebrow: "Documents / sign-off",
          title: "Nothing is waiting on your signature yet",
          body: "When Northridge is ready, you’ll review the requirements here and sign with a one-time code.",
        },
        {
          href: "/requests",
          eyebrow: "Requests",
          title: "2 questions still in draft",
          body: "Northridge has not sent them. You’ll see width, load rating, finish, and anchoring.",
        },
      ]
    : [
        {
          href: "/jobs",
          eyebrow: "Jobs",
          title: DEMO_PROJECT_WAREHOUSE_B.name,
          body: "Exterior steel stair is ready for sign-off pending live load and engineering review.",
        },
        {
          href: "/jobs/warehouse-b-stair/sign-off",
          eyebrow: "Sign-off",
          title: "Review requirements when invited",
          body: "Secure link and one-time code — demo only.",
        },
        {
          href: "/requests",
          eyebrow: "Requests",
          title: "1 question in draft",
          body: "Live load confirmation — not sent yet.",
        },
      ];

  const modules = session.role === "shop" ? shopModules : buyerModules;

  return (
    <PortalShell session={session} current="/dashboard">
      <PageIntro eyebrow={session.org} title={`Hello, ${session.name.split(" ")[0]}`}>
        <p>
          {session.role === "shop"
            ? "Shop-user home — switch customers from the cards below or the Customers nav."
            : `Customer home for ${session.org}. You only see this customer’s jobs and documents.`}
        </p>
      </PageIntro>
      <div className="portal-grid">
        {modules.map((mod) => (
          <ModuleCard key={mod.href + mod.title} {...mod} />
        ))}
      </div>
    </PortalShell>
  );
}
