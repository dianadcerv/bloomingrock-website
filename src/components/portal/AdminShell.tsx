import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { DemoBanner } from "@/components/portal/AuthChrome";
import { DemoNotesProvider, OpenQuestion } from "@/components/portal/DemoNotes";
import { WORKING_APP_TITLE } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";
import { isSuperAdmin, roleDisplayLabel } from "@/lib/portal/roles";
import type { PortalSession } from "@/lib/portal/session";

const SHOP_ADMIN_NAV = [
  { href: "/admin", label: "Shop admin home" },
  { href: "/admin/users", label: "People" },
  { href: "/admin/permissions", label: "Permissions" },
  { href: "/admin/categories", label: "Product categories" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/integrations", label: "Integrations" },
] as const;

const SUPERADMIN_NAV = [
  { href: "/admin/shops", label: "All shops" },
  { href: "/admin", label: "Northridge shop admin" },
  { href: "/dashboard", label: "Job intake home" },
] as const;

export function AdminShell({
  session,
  current,
  children,
}: {
  session: PortalSession;
  current?: string;
  children: React.ReactNode;
}) {
  const superadmin = isSuperAdmin(session.role);
  const nav = superadmin ? SUPERADMIN_NAV : SHOP_ADMIN_NAV;

  return (
    <DemoNotesProvider>
      <div className="portal portal-admin">
        <DemoBanner />
        <header className="portal-header">
          <Link href={superadmin ? "/admin/shops" : "/admin"} className="portal-header__brand">
            <BrandMark />
          </Link>
          <p className="portal-admin-app-title">
            {WORKING_APP_TITLE}
            <span className="look-field__hint"> — admin (demo)</span>
          </p>
          <nav className="portal-header__nav portal-header__nav--desktop" aria-label="Admin">
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
          <p className="portal-header__who portal-header__who--desktop">
            <span>
              {session.name} · {session.org}
            </span>
            <span className="portal-header__role">{roleDisplayLabel(session.role)}</span>
            <Link href="/auth/logout">Log out</Link>
          </p>
        </header>
        <main className="portal-main portal-main--admin">
          <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.appNameBLO38}</OpenQuestion>
          {children}
        </main>
      </div>
    </DemoNotesProvider>
  );
}
