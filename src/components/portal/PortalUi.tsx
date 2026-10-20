import Link from "next/link";
import type { CheckStatus } from "@/lib/portal/demo-data";
import type { StatusPillTone } from "@/lib/portal/demo-data";

export { OpenQuestion } from "@/components/portal/DemoNotes";

export type BadgeTone = "neutral" | "info" | "success" | "critical";

export function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return <span className={`portal-badge portal-badge--${tone}`}>{children}</span>;
}

function legacyToneToBadge(tone: StatusPillTone): BadgeTone {
  if (tone === "conflict") return "critical";
  if (tone === "ok") return "success";
  if (tone === "missing" || tone === "assumed") return "info";
  return "neutral";
}

export function badgeToneForCheckStatus(status: CheckStatus): BadgeTone {
  if (status === "conflict") return "critical";
  if (status === "complete") return "success";
  if (status === "missing" || status === "assumed") return "info";
  return "neutral";
}

/** @deprecated Prefer Badge — kept for gradual migration. */
export function StatusPill({
  tone,
  children,
}: {
  tone: StatusPillTone;
  children: React.ReactNode;
}) {
  return <Badge tone={legacyToneToBadge(tone)}>{children}</Badge>;
}

export function ModuleCard({
  href,
  eyebrow,
  title,
  body,
  variant = "default",
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  variant?: "default" | "nav";
}) {
  return (
    <Link
      href={href}
      className={variant === "nav" ? "portal-card portal-card--nav" : "portal-card"}
      aria-label={`${eyebrow}: ${title}`}
    >
      <p className="portal-card__eyebrow">{eyebrow}</p>
      <h2 className="portal-card__title">{title}</h2>
      <p className="portal-card__body">{body}</p>
      <span className="portal-card__open">Open</span>
    </Link>
  );
}

export function DraftNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="portal-draft" role="status">
      {children}
    </p>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="portal-intro">
      <p className="portal-intro__eyebrow">{eyebrow}</p>
      <h1 className="portal-intro__title">{title}</h1>
      {children}
    </header>
  );
}

/** @deprecated Use InterpretationMarker or ProvenanceMarks */
export function SuggestionBadge() {
  return <Badge tone="info">Needs a check</Badge>;
}
