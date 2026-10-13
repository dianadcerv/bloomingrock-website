import Link from "next/link";
import { StatusPill } from "@/components/portal/PortalUi";
import type { StatusPillTone } from "@/lib/portal/demo-data";

export function SummaryMetricTile({
  href,
  label,
  count,
  tone,
}: {
  href: string;
  label: string;
  count: number;
  tone: StatusPillTone;
}) {
  return (
    <Link href={href} className="portal-metric-tile">
      <span className="portal-metric-tile__count">{count}</span>
      <span className="portal-metric-tile__label">{label}</span>
      <StatusPill tone={tone}>{count === 0 ? "Clear" : "Open"}</StatusPill>
    </Link>
  );
}
