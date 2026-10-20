"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isShopStaff } from "@/lib/portal/roles";
import type { PortalSession } from "@/lib/portal/session";

function tabClass(active: boolean) {
  return `portal-tab-bar__tab${active ? " is-active" : ""}`;
}

export function PortalMobileNav({ session }: { session: PortalSession }) {
  const pathname = usePathname() ?? "";
  const shop = isShopStaff(session.role);

  const homeActive = pathname === "/dashboard" || pathname === "/";
  const jobsActive = pathname.startsWith("/jobs");
  const inboxActive = pathname.startsWith("/inbox");
  const moreActive =
    pathname.startsWith("/more") ||
    pathname.startsWith("/workflows") ||
    pathname.startsWith("/knowledge") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/activity") ||
    pathname.startsWith("/attention") ||
    pathname.startsWith("/requests");

  return (
    <nav className="portal-tab-bar" aria-label="Mobile">
      <Link href="/dashboard" className={tabClass(homeActive)}>
        Home
      </Link>
      <Link href="/jobs" className={tabClass(jobsActive)}>
        Jobs
      </Link>
      {shop ? (
        <Link href="/inbox" className={tabClass(inboxActive)}>
          Inbox
        </Link>
      ) : (
        <Link href="/requests" className={tabClass(pathname.startsWith("/requests"))}>
          Requests
        </Link>
      )}
      <Link href="/more" className={tabClass(moreActive)}>
        More
      </Link>
    </nav>
  );
}
