"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExtractedProvenanceMarker } from "@/components/portal/ProvenanceMarkers";
import type { DemoJob, DemoSource } from "@/lib/portal/demo-data";
import { getExtraSourcesForJob, INTAKE_UPDATED_EVENT } from "@/lib/portal/intake-store";

function sourceGatherLabel(kind: DemoSource["kind"], title: string) {
  if (kind === "email") return "Extracted from email (Oct 8)";
  if (title.includes("upload")) return "Pulled from customer upload link";
  return `From ${title}`;
}

export function JobSourcesClient({
  job,
  showShopLinks,
}: {
  job: DemoJob;
  showShopLinks: boolean;
}) {
  const [extra, setExtra] = useState<DemoSource[]>([]);

  useEffect(() => {
    const refresh = () => setExtra(getExtraSourcesForJob(job.id));
    refresh();
    window.addEventListener(INTAKE_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(INTAKE_UPDATED_EVENT, refresh);
  }, [job.id]);

  const sources = [...job.sources, ...extra];

  return (
    <section className="portal-section">
      <h2>Sources (reading order)</h2>
      <ul className="portal-plain">
        {sources.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <strong>{source.title}</strong>
            <span>
              {" "}
              · {source.kind} · {source.from}
            </span>
            <p>{source.summary}</p>
            <ExtractedProvenanceMarker
              label={sourceGatherLabel(source.kind, source.title)}
              jobId={job.id}
              sourceId={source.id}
            />
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
