import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice, OpenQuestion } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireRole } from "@/lib/portal/auth";
import { getJob } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

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
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.ocrTool}</OpenQuestion>
      <form className="portal-form" action="#">
        <label className="look-field">
          <span className="look-field__label">Confirm an email match</span>
          <select className="look-field__input" defaultValue="email-1" name="email">
            <option value="email-1">Need a platform off Line 3 — Jordan Hale</option>
            <option value="email-2">Also a small guard while you&apos;re here</option>
          </select>
        </label>
        <label className="look-field">
          <span className="look-field__label">Upload a file (PDF, image, Excel, CAD, ZIP…)</span>
          <input className="look-field__input" type="file" name="file" />
        </label>
        <p className="look-field__hint">
          Demo: PDFs and images would be read; CAD stored only; ZIP would list contents.
        </p>
        <label className="look-field">
          <span className="look-field__label">Add a note</span>
          <textarea className="look-field__input look-field__input--area" name="note" rows={4} />
        </label>
        <p>
          <Link href={`/jobs/${job.id}/transcript`}>Transcript or audio/video upload →</Link>
        </p>
        <button className="btn btn--primary" type="button" disabled>
          Save (demo)
        </button>
      </form>
    </PortalShell>
  );
}
