import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { PageIntro } from "@/components/portal/PortalUi";
import { requireSession } from "@/lib/portal/auth";
import { isShopAdmin, isShopStaff, roleDisplayLabel } from "@/lib/portal/roles";

export const metadata: Metadata = { title: "More" };

export default async function PortalMorePage() {
  const session = await requireSession();
  const shop = isShopStaff(session.role);

  const links = shop
    ? [
        { href: "/customers", label: "Customers" },
        { href: "/workflows", label: "Workflows" },
        { href: "/knowledge/library", label: "Knowledge" },
        { href: "/documents", label: "Documents" },
        { href: "/activity", label: "Activity" },
        { href: "/attention", label: "Needs attention" },
        ...(isShopAdmin(session.role) ? [{ href: "/admin", label: "Shop admin" }] : []),
        ...(session.role === "superadmin"
          ? [{ href: "/admin/shops", label: "Superadmin — customers" }]
          : []),
      ]
    : [
        { href: "/documents", label: "Documents" },
        { href: "/jobs", label: "Jobs" },
      ];

  return (
    <PortalShell session={session} current="/more">
      <PageIntro eyebrow="Account & workspace" title="More">
        <p>
          {session.name} · {session.org} · {roleDisplayLabel(session.role)}
        </p>
      </PageIntro>
      <ul className="portal-more-links">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
        <li>
          <Link href="/auth/logout">Log out</Link>
        </li>
      </ul>
    </PortalShell>
  );
}
