import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { getRecentAuditAcrossJobs } from "@/lib/portal/dashboard-data";

export const metadata: Metadata = { title: "Activity" };

export default async function ActivityPage() {
  const session = await requireShopStaff();
  const all = getRecentAuditAcrossJobs(999);

  return (
    <PortalShell session={session} current="/dashboard">
      <PageIntro eyebrow="Audit" title="Recent activity">
        <p>Across all demo jobs — who did what and when.</p>
      </PageIntro>
      <ul className="portal-plain portal-audit">
        {all.map((entry) => (
          <li key={entry.id}>
            <time>{entry.at}</time>
            <strong>{entry.who}</strong> — {entry.action} ·{" "}
            <Link href={`/jobs/${entry.jobId}/audit`}>{entry.jobName}</Link>
            <p>{entry.detail}</p>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/dashboard">← Back to home</Link>
      </p>
    </PortalShell>
  );
}
