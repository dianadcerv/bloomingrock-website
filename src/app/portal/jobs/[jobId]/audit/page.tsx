import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJobForShop } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Audit log" };

export default async function AuditPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJobForShop(jobId);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/audit`} />
      <DraftNotice>Demo audit entries only — who viewed and who sent what (proposal for controlled jobs).</DraftNotice>
      <ul className="portal-plain portal-audit">
        {job.auditLog.map((entry) => (
          <li key={entry.id}>
            <time dateTime={entry.at}>{entry.at}</time>
            <strong>{entry.who}</strong> — {entry.action}
            <p>{entry.detail}</p>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
