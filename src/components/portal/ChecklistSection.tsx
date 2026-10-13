import { OpenQuestion } from "@/components/portal/PortalUi";
import { ProvenanceLegend, ProvenanceMarks } from "@/components/portal/ProvenanceMarkers";
import { StatusPill } from "@/components/portal/PortalUi";
import {
  checkStatusLabel,
  getSource,
  type CheckStatus,
  type DemoJob,
} from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

function checkTone(status: CheckStatus) {
  if (status === "conflict") return "conflict" as const;
  if (status === "missing") return "missing" as const;
  if (status === "assumed") return "assumed" as const;
  return "ok" as const;
}

export function ChecklistSection({ job }: { job: DemoJob }) {
  const firstInterpretationIndex = job.checklist.findIndex((item) =>
    item.provenance?.some((m) => m.type === "interpretation"),
  );
  return (
    <section className="portal-section">
      <h2>Requirements checklist</h2>
      <ProvenanceLegend />
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.statusNames}</OpenQuestion>
      <ul className="portal-plain">
        {job.checklist.map((item, index) => (
          <li key={item.id} className="portal-check">
            <StatusPill tone={checkTone(item.status)}>
              {checkStatusLabel(item.status)}
            </StatusPill>
            <div>
              <strong>{item.label}</strong>
              {item.value ? <p>Value: {item.value}</p> : null}
              {item.provenance?.length ? (
                <ProvenanceMarks
                  marks={item.provenance}
                  jobId={job.id}
                  showInterpretationOpenQuestion={index === firstInterpretationIndex}
                />
              ) : item.reviewState === "needs-review" ? (
                <ProvenanceMarks
                  marks={[{ type: "interpretation" }]}
                  jobId={job.id}
                  showInterpretationOpenQuestion={index === firstInterpretationIndex}
                />
              ) : null}
              {item.note ? <p className="look-field__hint">{item.note}</p> : null}
              <p className="look-field__hint">
                Sources:{" "}
                {item.sourceIds.length
                  ? item.sourceIds
                      .map((id) => getSource(job, id)?.title ?? id)
                      .join(", ")
                  : "none yet"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
