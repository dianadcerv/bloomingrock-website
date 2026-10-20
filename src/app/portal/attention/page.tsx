import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { getShopAttentionItems } from "@/lib/portal/dashboard-data";

export const metadata: Metadata = { title: "Needs attention" };

export default async function AttentionPage() {
  const session = await requireShopStaff();
  const rows = getShopAttentionItems();

  return (
    <PortalShell session={session} current="/dashboard">
      <PageIntro eyebrow="Shop home" title="Needs your attention">
        <p>Ranked by urgency — demo data only.</p>
      </PageIntro>
      <ul className="portal-attention-list">
        {rows.map((row) => (
          <li key={row.id} className="portal-attention-list__item">
            <div className="portal-attention-list__body">
              <p className="portal-attention-list__title">{row.title}</p>
              <p>{row.detail}</p>
              <StatusPill tone={row.tone}>{row.statusLabel}</StatusPill>
            </div>
            <Link className="btn btn--primary" href={row.href}>
              {row.actionLabel}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/dashboard">← Back to home</Link>
      </p>
    </PortalShell>
  );
}
