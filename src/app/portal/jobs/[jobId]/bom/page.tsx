import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { getJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "BOM" };

export default async function BomPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireSession();
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  const csv = [
    "group,item,qty,notes",
    ...job.bom.map((row) =>
      [row.group, row.item, row.qty, row.notes].map((cell) => `"${cell}"`).join(","),
    ),
  ].join("\n");
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/bom`} role={session.role} />
      <DraftNotice>No prices. A person reviews every line.</DraftNotice>
      <p className="portal-inline-actions">
        <a className="btn btn--primary" href={csvHref} download={`${job.id}-bom.csv`}>
          Download CSV
        </a>
        <span className="look-field__hint">Excel/CSV · Print from the browser</span>
      </p>
      <table className="portal-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {job.bom.map((row) => (
            <tr key={row.id}>
              <td>{row.group}</td>
              <td>{row.item}</td>
              <td>{row.qty}</td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PortalShell>
  );
}
