import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { getJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Add source" };

export default async function AddSourcePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireRole("shop");
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/sources`} />
      <DraftNotice>
        FAKE DATA, DEMO ONLY — nothing is saved or sent from this screen.
      </DraftNotice>
      <form className="portal-form" action="#">
        <label className="look-field">
          <span className="look-field__label">Confirm an email match</span>
          <select className="look-field__input" defaultValue="email-1" name="email">
            <option value="email-1">Need a platform off Line 3 — Jordan Hale</option>
            <option value="email-2">Also a small guard while you&apos;re here</option>
          </select>
        </label>
        <label className="look-field">
          <span className="look-field__label">Upload a file</span>
          <input className="look-field__input" type="file" name="file" />
        </label>
        <label className="look-field">
          <span className="look-field__label">Add a note</span>
          <textarea className="look-field__input look-field__input--area" name="note" rows={4} />
        </label>
        <label className="look-field">
          <span className="look-field__label">Upload a transcript</span>
          <input className="look-field__input" type="file" name="transcript" />
        </label>
        <label className="portal-check-line">
          <input type="checkbox" name="consent" required />
          <span>
            Everyone on this call agreed to be recorded. Illinois requires
            all-party consent.
          </span>
        </label>
        <button className="btn btn--primary" type="button" disabled>
          Save (demo)
        </button>
      </form>
    </PortalShell>
  );
}
