"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OpenQuestion } from "@/components/portal/DemoNotes";
import { ProvenanceLegend, ProvenanceMarks } from "@/components/portal/ProvenanceMarkers";
import { Badge, badgeToneForCheckStatus } from "@/components/portal/PortalUi";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";
import {
  checkStatusLabel,
  getSource,
  type DemoJob,
} from "@/lib/portal/demo-data";
import {
  getResolutions,
  JOB_CONFLICT_UPDATED_EVENT,
  resolveConflict,
  sourceShortLabel,
  type ConflictResolution,
} from "@/lib/portal/job-conflicts-store";

function ConflictChoices({
  job,
  itemId,
  fieldLabel,
  left,
  right,
  resolved,
  who,
}: {
  job: DemoJob;
  itemId: string;
  fieldLabel: string;
  left: { sourceId: string; value: string };
  right: { sourceId: string; value: string };
  resolved: ConflictResolution | undefined;
  who: string;
}) {
  if (resolved) {
    return (
      <p className="portal-conflict-resolved">
        Using <strong>{resolved.chosenValue}</strong> ({sourceShortLabel(resolved.chosenSourceId)})
      </p>
    );
  }

  const pick = (side: typeof left) => {
    resolveConflict(job.id, {
      checklistItemId: itemId,
      fieldLabel,
      chosenValue: side.value,
      chosenSourceId: side.sourceId,
      who,
    });
  };

  return (
    <div className="portal-conflict-choices">
      <p className="portal-conflict-choices__lead">Pick the value to hold for this job:</p>
      <div className="portal-conflict-choices__buttons">
        <button type="button" className="btn btn--secondary" onClick={() => pick(left)}>
          {left.value} ({sourceShortLabel(left.sourceId)})
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => pick(right)}>
          {right.value} ({sourceShortLabel(right.sourceId)})
        </button>
        <Link className="btn btn--quiet" href={`/jobs/${job.id}/missing`}>
          Ask customer
        </Link>
      </div>
    </div>
  );
}

export function JobChecklistClient({ job, who }: { job: DemoJob; who: string }) {
  const [resolutions, setResolutions] = useState<ConflictResolution[]>(() =>
    typeof window === "undefined" ? [] : getResolutions(job.id),
  );

  useEffect(() => {
    const refresh = () => setResolutions(getResolutions(job.id));
    refresh();
    window.addEventListener(JOB_CONFLICT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(JOB_CONFLICT_UPDATED_EVENT, refresh);
  }, [job.id]);

  const conflictByField = useMemo(() => {
    const map = new Map<string, (typeof job.conflicts)[0]>();
    for (const c of job.conflicts) map.set(c.field.toLowerCase(), c);
    return map;
  }, [job]);

  if (job.controlledHold) {
    return (
      <section className="portal-section" id="requirements-checklist">
        <h2>Requirements checklist</h2>
        <p className="look-field__hint">
          No checklist for this job — controlled hold. Nothing was extracted or suggested.
        </p>
      </section>
    );
  }

  return (
    <section className="portal-section" id="requirements-checklist">
      <h2>Requirements checklist</h2>
      <ProvenanceLegend />
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.statusNames}</OpenQuestion>
      <ul className="portal-plain">
        {job.checklist.map((item) => {
          const resolution = resolutions.find((r) => r.checklistItemId === item.id);
          const isConflict = item.status === "conflict" && !resolution;
          const conflict = conflictByField.get(item.label.toLowerCase());
          const displayStatus = resolution ? "complete" : item.status;

          return (
            <li key={item.id} className="portal-check" id={isConflict ? `conflict-${item.id}` : undefined}>
              <Badge tone={badgeToneForCheckStatus(displayStatus)}>
                {checkStatusLabel(displayStatus)}
              </Badge>
              <div>
                <strong>{item.label}</strong>
                {item.value && !isConflict ? <p>Value: {resolution?.chosenValue ?? item.value}</p> : null}
                {isConflict && conflict ? (
                  <ConflictChoices
                    job={job}
                    itemId={item.id}
                    fieldLabel={item.label}
                    left={conflict.left}
                    right={conflict.right}
                    resolved={resolution}
                    who={who}
                  />
                ) : null}
                {item.provenance?.length ? (
                  <ProvenanceMarks marks={item.provenance} jobId={job.id} />
                ) : item.reviewState === "needs-review" ? (
                  <ProvenanceMarks
                    marks={[{ type: "interpretation" }]}
                    jobId={job.id}
                  />
                ) : null}
                {item.note && !isConflict ? <p className="look-field__hint">{item.note}</p> : null}
                <p className="look-field__hint">
                  Sources:{" "}
                  {item.sourceIds.length
                    ? item.sourceIds.map((id) => getSource(job, id)?.title ?? id).join(", ")
                    : "none yet"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
