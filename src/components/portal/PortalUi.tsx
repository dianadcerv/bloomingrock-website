import Link from "next/link";

export function ModuleCard({
  href,
  eyebrow,
  title,
  body,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="portal-card">
      <p className="portal-card__eyebrow">{eyebrow}</p>
      <h2 className="portal-card__title">{title}</h2>
      <p className="portal-card__body">{body}</p>
      <span className="portal-card__open">Open</span>
    </Link>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "conflict" | "missing" | "ok" | "draft" | "assumed";
  children: React.ReactNode;
}) {
  return <span className={`portal-pill portal-pill--${tone}`}>{children}</span>;
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
