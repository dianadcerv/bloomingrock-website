import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { DemoBanner } from "@/components/portal/AuthChrome";
import type { PortalSession } from "@/lib/portal/session";

const SHOP_NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/inbox", label: "Inbox" },
  { href: "/jobs", label: "Jobs" },
  { href: "/workflows", label: "Workflows" },
  { href: "/documents", label: "Documents" },
] as const;

const BUYER_NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/documents", label: "Documents" },
  { href: "/requests", label: "Requests" },
] as const;

export function PortalShell({
  session,
  current,
  children,
}: {
  session: PortalSession;
  current?: string;
  children: React.ReactNode;
}) {
  const nav = session.role === "shop" ? SHOP_NAV : BUYER_NAV;
  const roleLabel = session.role === "shop" ? "Shop user" : "Customer";

  return (
    <div className="portal">
      <DemoBanner />
      <header className="portal-header">
        <Link href="/dashboard" className="portal-header__brand" aria-label="Portal home">
          <BrandMark />
        </Link>
        <nav className="portal-header__nav" aria-label="Portal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`portal-header__link${current === item.href ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="portal-header__who">
          <span>
            {session.name} · {session.org}
          </span>
          <span className="portal-header__role">{roleLabel}</span>
          <Link href="/auth/logout">Log out</Link>
        </p>
      </header>
      <main className="portal-main">{children}</main>
    </div>
  );
}
