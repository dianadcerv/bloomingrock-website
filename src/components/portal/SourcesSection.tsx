import Link from "next/link";
import { ExtractedProvenanceMarker } from "@/components/portal/ProvenanceMarkers";
import type { DemoJob } from "@/lib/portal/demo-data";

function sourceGatherLabel(kind: DemoJob["sources"][0]["kind"], title: string) {
  if (kind === "email") return "Extracted from email (Oct 8)";
  if (kind === "call") return "From transcript: walkthrough-call.m4a";
  if (kind === "sketch") return "OCR from drawing PDF (Oct 8)";
  if (kind === "pdf" && title.includes("Rev C")) return "OCR from drawing PDF (Oct 9)";
  if (kind === "pdf") return "From document PDF";
  return `From ${title}`;
}

export function SourcesSection({
  job,
  showShopLinks,
}: {
  job: DemoJob;
  showShopLinks: boolean;
}) {
  return (
    <section className="portal-section">
      <h2>Sources (reading order)</h2>
      <ul className="portal-plain">
        {job.sources.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <strong>{source.title}</strong>
            <span>
              {" "}
              · {source.kind} · {source.from}
            </span>
            <p>{source.summary}</p>
            {source.quote ? (
              <p className="look-field__hint">Quoted: “{source.quote}”</p>
            ) : null}
            {source.readByApp === false ? (
              <p className="look-field__hint">Stored only — not read in this demo.</p>
            ) : (
              <ExtractedProvenanceMarker
                label={sourceGatherLabel(source.kind, source.title)}
                jobId={job.id}
                sourceId={source.id}
              />
            )}
            {source.assetPath ? (
              <p>
                <Link href={`/jobs/${job.id}/sources/${source.id}/preview`}>View PDF preview</Link>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {showShopLinks ? (
        <p>
          <Link href={`/jobs/${job.id}/sources`}>Add a source</Link>
          {" · "}
          <Link href={`/jobs/${job.id}/transcript`}>Transcript / recording upload</Link>
        </p>
      ) : null}
    </section>
  );
}
