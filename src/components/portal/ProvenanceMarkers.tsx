import Link from "next/link";
import { Badge } from "@/components/portal/PortalUi";
import type { ProvenanceMark } from "@/lib/portal/provenance";
import { sourceHref } from "@/lib/portal/provenance";

export function ProvenanceLegend() {
  return (
    <div className="portal-provenance-legend" role="note" aria-label="How values are labeled">
      <p className="portal-provenance-legend__title">How values are labeled</p>
      <ul>
        <li>
          <Badge tone="neutral">Your team added</Badge> — someone on your team entered this on the
          job (who + when).
        </li>
        <li>
          <Badge tone="info">Pulled from a source</Badge> — quoted from email, drawing, transcript,
          or another file (link back).
        </li>
        <li>
          <Badge tone="info">Needs a check</Badge> — inferred or summarized; a person should
          confirm before sign-off.
        </li>
      </ul>
    </div>
  );
}

export function InstitutionalKnowledgeMarker({
  addedBy,
  addedAt,
}: {
  addedBy: string;
  addedAt: string;
}) {
  return (
    <span className="portal-provenance portal-provenance--institutional">
      Your team added · {addedBy} · {addedAt}
    </span>
  );
}

export function ExtractedProvenanceMarker({
  label,
  jobId,
  sourceId,
}: {
  label: string;
  jobId?: string;
  sourceId?: string;
}) {
  const display = label.replace(/^Extracted from /i, "Pulled from ");
  const inner = <span className="portal-provenance portal-provenance--extracted">{display}</span>;
  if (jobId && sourceId) {
    return (
      <Link href={sourceHref(jobId, sourceId)} className="portal-provenance-link">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function InterpretationMarker() {
  return (
    <span className="portal-provenance portal-provenance--interpretation">Needs a check</span>
  );
}

export function ProvenanceMarks({
  marks,
  jobId,
}: {
  marks: ProvenanceMark[];
  jobId: string;
}) {
  if (!marks.length) return null;
  return (
    <div className="portal-provenance-stack">
      {marks.map((mark, i) => {
        if (mark.type === "institutional") {
          return (
            <InstitutionalKnowledgeMarker
              key={`${mark.type}-${i}`}
              addedBy={mark.addedBy}
              addedAt={mark.addedAt}
            />
          );
        }
        if (mark.type === "extracted") {
          return (
            <ExtractedProvenanceMarker
              key={`${mark.type}-${i}`}
              label={mark.label}
              jobId={mark.jobId ?? jobId}
              sourceId={mark.sourceId}
            />
          );
        }
        return <InterpretationMarker key={`${mark.type}-${i}`} />;
      })}
    </div>
  );
}
