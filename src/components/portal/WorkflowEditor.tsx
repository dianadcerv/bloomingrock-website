"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { OpenQuestion, StatusPill } from "@/components/portal/PortalUi";
import type { AuditEntry, WorkflowStep } from "@/lib/portal/demo-data";
import { DEMO_SHOP_ROLES, PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

function newAudit(
  who: string,
  action: string,
  detail: string,
  seq: number,
): AuditEntry {
  return {
    id: `demo-audit-${Date.now()}-${seq}`,
    at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
    who,
    action,
    detail,
  };
}

function stepKindLabel(kind: WorkflowStep["kind"]) {
  if (kind === "knowledge-added") return "From knowledge";
  if (kind === "added") return "Added";
  if (kind === "ideal") return "Ideal";
  return "Minimum";
}

function stepKindClass(kind: WorkflowStep["kind"]) {
  if (kind === "knowledge-added") return "portal-step--knowledge";
  if (kind === "added") return "portal-step--added";
  if (kind === "ideal") return "portal-step--ideal";
  return "portal-step--minimum";
}

export function WorkflowEditor({
  jobId,
  jobName,
  actorName,
  initialSteps,
}: {
  jobId: string;
  jobName: string;
  actorName: string;
  initialSteps: WorkflowStep[];
}) {
  const [steps, setSteps] = useState<WorkflowStep[]>(() => {
    const base = initialSteps.map((s) => ({ ...s }));
    if (typeof window === "undefined") return base;
    try {
      const raw = sessionStorage.getItem(`demo-knowledge-steps-${jobId}`);
      if (!raw) return base;
      const extra = JSON.parse(raw) as WorkflowStep[];
      const ids = new Set(base.map((s) => s.id));
      return [...base, ...extra.filter((s) => !ids.has(s.id))];
    } catch {
      return base;
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(initialSteps[0]?.id ?? null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const auditSeq = useRef(0);

  const pushAudit = useCallback((action: string, detail: string) => {
    setAuditLog((prev) => [
      newAudit(actorName, action, detail, auditSeq.current++),
      ...prev,
    ]);
  }, [actorName]);

  const selected = useMemo(
    () => steps.find((s) => s.id === selectedId) ?? null,
    [steps, selectedId],
  );

  const updateSelected = (patch: Partial<WorkflowStep>) => {
    if (!selectedId) return;
    setSteps((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)),
    );
  };

  const saveSelectedDetails = () => {
    if (!selected) return;
    pushAudit("Edited workflow step", `"${selected.label}" details saved (demo session).`);
  };

  const addStep = () => {
    const id = `added-${Date.now()}`;
    const step: WorkflowStep = {
      id,
      label: "New expert step",
      kind: "added",
      done: false,
      ownerRole: "Estimator",
      notes: "Added from team experience — distinct from happy path.",
    };
    setSteps((prev) => [...prev, step]);
    setSelectedId(id);
    pushAudit("Added workflow step", `"${step.label}" on ${jobName}.`);
  };

  const removeStep = (id: string) => {
    const step = steps.find((s) => s.id === id);
    if (!step || step.kind === "minimum") return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    pushAudit("Removed workflow step", `"${step.label}" removed from ${jobName}.`);
  };

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setSteps((prev) => {
      const from = prev.findIndex((s) => s.id === dragId);
      const to = prev.findIndex((s) => s.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    pushAudit("Moved workflow step", `Reordered steps on ${jobName} (demo drag-and-drop).`);
    setDragId(null);
  };

  return (
    <div className="portal-workflow-editor">
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.workflowEditPermissions}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.templateVsJobScope}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.workflowVersioningRollback}</OpenQuestion>
      <p className="look-field__hint">
        Happy path = minimum steps from predefined intake questions. Drag to reorder. Changes
        apply to <strong>this job only</strong> in the demo — shop templates come in Phase 2
        admin.
      </p>
      <div className="portal-workflow-layout">
        <div>
          <p className="portal-inline-actions">
            <button className="btn btn--primary" type="button" onClick={addStep}>
              Add step
            </button>
            <Link className="btn btn--quiet portal-btn-quiet" href={`/jobs/${jobId}/knowledge`}>
              Add expert knowledge →
            </Link>
            <Link className="btn btn--quiet portal-btn-quiet" href="/knowledge/library">
              Knowledge library
            </Link>
          </p>
          <ol className="portal-steps portal-steps--editor">
            {steps.map((step) => (
              <li
                key={step.id}
                className={`portal-step ${stepKindClass(step.kind)}${selectedId === step.id ? " is-selected" : ""}`}
                draggable
                onDragStart={() => setDragId(step.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(step.id)}
              >
                <button
                  type="button"
                  className="portal-step__drag"
                  aria-label="Drag to reorder"
                  title="Drag to reorder"
                >
                  ⋮⋮
                </button>
                <button
                  type="button"
                  className="portal-step__main"
                  onClick={() => setSelectedId(step.id)}
                >
                  <span>{step.label}</span>
                  {step.ownerRole ? (
                    <span className="look-field__hint">{step.ownerRole}</span>
                  ) : null}
                </button>
                <StatusPill tone={step.kind === "added" || step.kind === "knowledge-added" ? "assumed" : step.done ? "ok" : "draft"}>
                  {stepKindLabel(step.kind)}
                  {step.done ? " · done" : ""}
                </StatusPill>
                {step.kind !== "minimum" ? (
                  <button
                    type="button"
                    className="portal-step__remove"
                    onClick={() => removeStep(step.id)}
                    aria-label={`Remove ${step.label}`}
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
        <aside className="portal-step-detail">
          <h2>Step details</h2>
          {selected ? (
            <form
              className="portal-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label className="look-field">
                <span className="look-field__label">Name</span>
                <input
                  className="look-field__input"
                  value={selected.label}
                  onChange={(e) => updateSelected({ label: e.target.value })}
                />
              </label>
              <label className="look-field">
                <span className="look-field__label">Owner role (renamable)</span>
                <select
                  className="look-field__input"
                  value={selected.ownerRole ?? "Estimator"}
                  onChange={(e) => updateSelected({ ownerRole: e.target.value })}
                >
                  {DEMO_SHOP_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label className="look-field">
                <span className="look-field__label">Required inputs</span>
                <textarea
                  className="look-field__input look-field__input--area"
                  rows={2}
                  value={selected.inputs ?? ""}
                  onChange={(e) => updateSelected({ inputs: e.target.value })}
                />
              </label>
              <label className="look-field">
                <span className="look-field__label">Outputs</span>
                <textarea
                  className="look-field__input look-field__input--area"
                  rows={2}
                  value={selected.outputs ?? ""}
                  onChange={(e) => updateSelected({ outputs: e.target.value })}
                />
              </label>
              <label className="look-field">
                <span className="look-field__label">Notes</span>
                <textarea
                  className="look-field__input look-field__input--area"
                  rows={3}
                  value={selected.notes ?? ""}
                  onChange={(e) => updateSelected({ notes: e.target.value })}
                />
              </label>
              <p className="look-field__hint">
                Type: {stepKindLabel(selected.kind)}. Minimum steps cannot be removed.
              </p>
              <button className="btn btn--primary" type="button" onClick={saveSelectedDetails}>
                Save step (demo audit)
              </button>
            </form>
          ) : (
            <p>Select a step to edit details.</p>
          )}
        </aside>
      </div>
      <section className="portal-section">
        <h2>Session audit (demo)</h2>
        <p className="look-field__hint">
          Each change below would append to the job audit log.{" "}
          <Link href={`/jobs/${jobId}/audit`}>Full audit log →</Link>
        </p>
        {auditLog.length ? (
          <ul className="portal-plain portal-audit">
            {auditLog.map((entry) => (
              <li key={entry.id}>
                <time>{entry.at}</time>
                <strong>{entry.who}</strong> — {entry.action}
                <p>{entry.detail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No edits yet this session — try drag, add, or edit a step.</p>
        )}
      </section>
    </div>
  );
}

export function WorkflowReadOnly({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="portal-steps">
      {steps.map((step) => (
        <li key={step.id} className={`portal-step ${stepKindClass(step.kind)}`}>
          <span>{step.label}</span>
          <StatusPill tone={step.done ? "ok" : "draft"}>{stepKindLabel(step.kind)}</StatusPill>
        </li>
      ))}
    </ol>
  );
}
