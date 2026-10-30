import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJob } from "@/lib/portal/auth";
import { getSource } from "@/lib/portal/demo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string; sourceId: string }>;
}): Promise<Metadata> {
  const { sourceId } = await params;
  return { title: sourceId === "drawing-rev-c" ? "Drawing preview (Rev C)" : "Source preview" };
}

export default async function SourcePreviewPage({
  params,
}: {
  params: Promise<{ jobId: string; sourceId: string }>;
}) {
  const { jobId, sourceId } = await params;
  const { session, job } = await requireJob(jobId);
  const source = getSource(job, sourceId);
  if (!source?.assetPath) notFound();

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}`} role={session.role} />
      <DraftNotice>
        FAKE DATA — demo PDF only. Title block is marked DEMO / fake; not for construction.
      </DraftNotice>
      <h1 className="portal-intro__title">{source.title}</h1>
      <p className="look-field__hint">{source.summary}</p>
      <p className="portal-inline-actions">
        <a className="btn btn--quiet portal-btn-quiet" href={source.assetPath} target="_blank" rel="noreferrer">
          Open PDF in new tab
        </a>
        <Link className="btn btn--quiet portal-btn-quiet" href={`/jobs/${job.id}#source-${source.id}`}>
          Back to sources on job
        </Link>
      </p>
      <div className="portal-pdf-preview">
        <iframe
          title={`PDF preview: ${source.title}`}
          src={source.assetPath}
          className="portal-pdf-preview__frame"
        />
      </div>
    </PortalShell>
  );
}
