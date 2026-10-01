import Link from "next/link";
import { StatusPill } from "@/components/portal/PortalUi";
import {
  DEMO_CUSTOMER,
  DEMO_PROJECT,
  jobStatusLabel,
  type DemoJob,
} from "@/lib/portal/demo-data";

function toneFor(status: DemoJob["status"]) {
  if (status === "conflict") return "conflict" as const;
  if (status === "waiting-on-customer") return "missing" as const;
  if (status === "ready-for-signoff" || status === "signed") return "ok" as const;
  return "draft" as const;
}

export function JobHeader({
  job,
  current,
  role = "shop",
}: {
  job: DemoJob;
  current: string;
  role?: "shop" | "buyer";
}) {
  const links = [
    { href: `/jobs/${job.id}`, label: "Workspace" },
    ...(role === "shop"
      ? [
          { href: `/jobs/${job.id}/sources`, label: "Add source" },
          { href: `/jobs/${job.id}/workflow`, label: "Workflow" },
          { href: `/jobs/${job.id}/missing`, label: "Missing info" },
          { href: `/jobs/${job.id}/knowledge`, label: "Knowledge" },
        ]
      : [{ href: `/jobs/${job.id}/workflow`, label: "Workflow" }]),
    { href: `/jobs/${job.id}/sign-off`, label: "Sign-off" },
    { href: `/jobs/${job.id}/agreement`, label: "Agreement" },
    { href: `/jobs/${job.id}/bom`, label: "BOM" },
    { href: `/jobs/${job.id}/pdf`, label: "PDF" },
  ];

  return (
    <div className="job-head">
      <p className="portal-intro__eyebrow">
        {DEMO_CUSTOMER.name} · {DEMO_PROJECT.name}
      </p>
      <div className="job-head__title-row">
        <h1 className="portal-intro__title">{job.name}</h1>
        <StatusPill tone={toneFor(job.status)}>{jobStatusLabel(job.status)}</StatusPill>
      </div>
      <p className="job-head__summary">{job.summary}</p>
      <nav className="job-subnav" aria-label="Job sections">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={current === link.href ? "is-active" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
