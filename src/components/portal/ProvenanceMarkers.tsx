import Link from "next/link";
import { OpenQuestion } from "@/components/portal/PortalUi";
import type { ProvenanceMark } from "@/lib/portal/provenance";
import { sourceHref } from "@/lib/portal/provenance";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export function ProvenanceLegend() {
  return (
    <div className="portal-provenance-legend" role="note" aria-label="Provenance legend">
      <p className="portal-provenance-legend__title">How values are labeled</p>
      <ul>
        <li>
          <span className="portal-provenance portal-provenance--institutional">
            Institutional knowledge
          </span>
          — captured by your team during the order (who + when).
        </li>
        <li>
          <span className="portal-provenance portal-provenance--extracted">Extracted from …</span>
          — quoted or OCR’d from email, transcript, drawing, or another connected source (link
          back).
        </li>
        <li>
          <span className="portal-provenance portal-provenance--interpretation">
            Interpretation, needs review
          </span>
          — inferred, not verbatim from a source; a person must confirm.
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
      Institutional knowledge · {addedBy} · {addedAt}
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
  const inner = <span className="portal-provenance portal-provenance--extracted">{label}</span>;
  if (jobId && sourceId) {
    return (
      <Link href={sourceHref(jobId, sourceId)} className="portal-provenance-link">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function InterpretationMarker({ showOpenQuestion = false }: { showOpenQuestion?: boolean }) {
  return (
    <span className="portal-provenance-block">
      <span className="portal-provenance portal-provenance--interpretation">
        Interpretation, needs review
      </span>
      {showOpenQuestion ? (
        <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.interpretationAccuracyHarness}</OpenQuestion>
      ) : null}
    </span>
  );
}

export function ProvenanceMarks({
  marks,
  jobId,
  showInterpretationOpenQuestion,
}: {
  marks: ProvenanceMark[];
  jobId: string;
  /** Show accuracy harness open question once per page section, not every row. */
  showInterpretationOpenQuestion?: boolean;
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
        return (
          <InterpretationMarker
            key={`${mark.type}-${i}`}
            showOpenQuestion={showInterpretationOpenQuestion}
          />
        );
      })}
    </div>
  );
}
