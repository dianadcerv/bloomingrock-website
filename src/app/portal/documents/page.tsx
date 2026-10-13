import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { jobsForSession } from "@/lib/portal/access";
import { requireSession } from "@/lib/portal/auth";
import { getCustomerForJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const session = await requireSession();
  const jobs = jobsForSession(session);

  return (
    <PortalShell session={session} current="/documents">
      <PageIntro eyebrow="Sign-off / documents" title="Documents">
        <p>
          Drafts per job — nothing sent in the demo.
          {session.role === "shop" ? " Meridian and Harborview jobs listed separately." : ""}
        </p>
      </PageIntro>
      {jobs.map((job) => {
        const customer = getCustomerForJob(job);
        const items = [
          { href: `/jobs/${job.id}/sign-off`, title: "Customer sign-off" },
          { href: `/jobs/${job.id}/agreement`, title: "Work order agreement" },
          { href: `/jobs/${job.id}/bom`, title: "Bill of materials" },
          { href: `/jobs/${job.id}/pdf`, title: "Requirements PDF" },
        ];
        if (session.role === "shop" && job.controlledProposal) {
          items.push({
            href: `/jobs/${job.id}/controlled`,
            title: "Controlled job (proposal)",
          });
        }
        return (
          <section key={job.id} className="portal-jobs-group">
            <h2>
              {customer?.name} · {job.name}
            </h2>
            <ul className="portal-list">
              {items.map((item) => (
                <li key={item.href} className="portal-list__item">
                  <div>
                    <h3>{item.title}</h3>
                  </div>
                  <Link className="btn btn--primary" href={item.href}>
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </PortalShell>
  );
}
