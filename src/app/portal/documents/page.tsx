import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { JOBS } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const session = await requireSession();
  const job = JOBS[0];

  const items = [
    { href: `/jobs/${job.id}/sign-off`, title: "Customer sign-off", body: "Link and code step · customer view · internal view" },
    { href: `/jobs/${job.id}/agreement`, title: "Work order agreement", body: "Placeholder body in the shop’s branding" },
    { href: `/jobs/${job.id}/bom`, title: "Bill of materials", body: "Group, sort, CSV — no prices" },
    { href: `/jobs/${job.id}/pdf`, title: "Requirements PDF", body: "Preview with a drafted email, not sent" },
  ];

  if (session.role === "shop") {
    items.push({
      href: `/jobs/${job.id}/controlled`,
      title: "Controlled job (proposal)",
      body: "Flags and hard-stop until attorney and hosting reviews",
    });
  }

  return (
    <PortalShell session={session} current="/documents">
      <PageIntro eyebrow="Sign-off / documents" title="Documents">
        <p>Drafts for the access platform. Nothing is sent from the demo.</p>
      </PageIntro>
      <ul className="portal-list">
        {items.map((item) => (
          <li key={item.href} className="portal-list__item">
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
            <Link className="btn btn--primary" href={item.href}>
              Open
            </Link>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
