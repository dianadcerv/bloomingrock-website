import Link from "next/link";
import type { StatusPillTone } from "@/lib/portal/demo-data";

function MetricIcon({ id }: { id: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "inbox":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="M4 10h16" />
        </svg>
      );
    case "conflicts":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4" />
          <path d="M5 12H3M21 12h-2" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M9 11l2 2 4-4" />
          <rect x="4" y="4" width="16" height="16" rx="1" />
        </svg>
      );
    case "waiting":
    case "waiting-you":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "drafts":
      return (
        <svg {...common}>
          <path d="M6 4h10l4 4v12H6z" />
          <path d="M16 4v4h4" />
        </svg>
      );
    case "jobs":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    case "signoff":
      return (
        <svg {...common}>
          <path d="M6 12l4 4 8-8" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function SummaryMetricTile({
  id,
  href,
  label,
  count,
  tone,
}: {
  id: string;
  href: string;
  label: string;
  count: number;
  tone: StatusPillTone;
}) {
  return (
    <Link
      href={href}
      className={`portal-metric-tile portal-metric-tile--${tone}`}
      aria-label={`${count} ${label}`}
    >
      <span className="portal-metric-tile__icon">
        <MetricIcon id={id} />
      </span>
      <span className="portal-metric-tile__count">{count}</span>
      <span className="portal-metric-tile__label">{label}</span>
    </Link>
  );
}
