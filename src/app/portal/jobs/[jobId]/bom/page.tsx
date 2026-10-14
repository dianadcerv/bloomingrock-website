import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { PrintButton } from "@/components/portal/PrintButton";
import { ProvenanceLegend, ProvenanceMarks } from "@/components/portal/ProvenanceMarkers";
import { DraftNotice, OpenQuestion } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "BOM" };

export default async function BomPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJob(jobId);

  const csv = [
    "group,description,qty,material,vendor,vendor_part,notes",
    ...job.bom.map((row) =>
      [row.group, row.description, row.qty, row.material, row.vendor, row.vendorPart, row.notes]
        .map((cell) => `"${cell}"`)
        .join(","),
    ),
  ].join("\n");
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/bom`} role={session.role} />
      <DraftNotice>No prices. Engineer reviews and approves every line.</DraftNotice>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.bomDraftVsHand}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.bomDownloadFormat}</OpenQuestion>
      <ProvenanceLegend />
      <p className="portal-inline-actions">
        <a className="btn btn--primary" href={csvHref} download={`${job.id}-bom.csv`}>
          Download CSV
        </a>
        <PrintButton />
        <span className="look-field__hint">Group/sort is a view option only — demo table is grouped.</span>
      </p>
      <table className="portal-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Material</th>
            <th>Vendor</th>
            <th>Vendor part #</th>
            <th>Notes</th>
            <th>Provenance</th>
          </tr>
        </thead>
        <tbody>
          {job.bom.map((row) => (
            <tr key={row.id}>
              <td>{row.group}</td>
              <td>{row.description}</td>
              <td>{row.qty}</td>
              <td>{row.material}</td>
              <td>{row.vendor}</td>
              <td>{row.vendorPart}</td>
              <td>{row.notes}</td>
              <td>
                {row.provenance?.length ? (
                  <ProvenanceMarks marks={row.provenance} jobId={job.id} />
                ) : (
                  <span className="look-field__hint">Hand-entered (demo)</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PortalShell>
  );
}
