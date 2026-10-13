"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { OpenQuestion, StatusPill, SuggestionBadge } from "@/components/portal/PortalUi";
import type { AuditEntry, WorkflowStep } from "@/lib/portal/demo-data";
import type { ExpertKnowledgeTip } from "@/lib/portal/expert-knowledge";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export type AcceptedKnowledge = {
  tipId: string;
  checklistLabel?: string;
  workflowStep?: WorkflowStep;
};

function newAudit(who: string, action: string, detail: string, seq: number): AuditEntry {
  return {
    id: `k-audit-${Date.now()}-${seq}`,
    at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
    who,
    action,
    detail,
  };
}

export function KnowledgeJobWorkspace({
  jobId,
  jobName,
  actorName,
  workflowSteps,
  suggestions,
  capturedOnJob,
}: {
  jobId: string;
  jobName: string;
  actorName: string;
  workflowSteps: WorkflowStep[];
  suggestions: ExpertKnowledgeTip[];
  capturedOnJob: string[];
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [accepted, setAccepted] = useState<AcceptedKnowledge[]>([]);
  const [localTips, setLocalTips] = useState<ExpertKnowledgeTip[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const auditSeq = useRef(0);

  const pushAudit = useCallback((action: string, detail: string) => {
    setAuditLog((prev) => [
      newAudit(actorName, action, detail, auditSeq.current++),
      ...prev,
    ]);
  }, [actorName]);

  const visibleSuggestions = useMemo(
    () => suggestions.filter((t) => !dismissed.has(t.id) && !accepted.some((a) => a.tipId === t.id)),
    [suggestions, dismissed, accepted],
  );

  const acceptTip = (tip: ExpertKnowledgeTip) => {
    const workflowStep: WorkflowStep | undefined = tip.suggestStepLabel
      ? {
          id: `kn-${tip.id}`,
          label: tip.suggestStepLabel,
          kind: "knowledge-added",
          done: false,
          ownerRole: "Estimator",
          notes: `From knowledge: ${tip.text}`,
          fromKnowledgeId: tip.id,
        }
      : undefined;

    setAccepted((prev) => [
      ...prev,
      {
        tipId: tip.id,
        checklistLabel: tip.suggestChecklistLabel,
        workflowStep,
      },
    ]);
    if (workflowStep) {
      try {
        const key = `demo-knowledge-steps-${jobId}`;
        const existing = JSON.parse(sessionStorage.getItem(key) ?? "[]") as WorkflowStep[];
        sessionStorage.setItem(key, JSON.stringify([...existing, workflowStep]));
      } catch {
        /* demo storage */
      }
    }
    pushAudit(
      "Accepted knowledge suggestion",
      `"${tip.text.slice(0, 60)}…" on ${jobName} — person added to workflow/checklist (demo).`,
    );
  };

  const dismissTip = (tip: ExpertKnowledgeTip) => {
    setDismissed((prev) => new Set(prev).add(tip.id));
    pushAudit("Dismissed knowledge suggestion", `Skipped tip ${tip.id} on ${jobName}.`);
  };

  const submitNewTip = (form: FormData) => {
    const text = String(form.get("text") ?? "").trim();
    if (!text) return;
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const sourceNote = String(form.get("sourceNote") ?? "").trim();
    const stepId = String(form.get("stepId") ?? "");
    const file = form.get("file") as File | null;
    const tip: ExpertKnowledgeTip = {
      id: `local-${Date.now()}`,
      text,
      tags,
      sourceNote,
      createdBy: actorName,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
      originJobId: jobId,
      originJobName: jobName,
      attachedStepId: stepId || undefined,
      fileName: file && file.size > 0 ? file.name : undefined,
      history: [{ at: new Date().toISOString(), who: actorName, change: "Created in demo session." }],
    };
    setLocalTips((prev) => [tip, ...prev]);
    pushAudit("Added expert knowledge", `"${text.slice(0, 50)}…" tagged [${tags.join(", ")}].`);
  };

  return (
    <div className="portal-knowledge-workspace">
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.knowledgeApproval}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.templateVsJobScope}</OpenQuestion>

      <section className="portal-section">
        <h2>Add expert knowledge</h2>
        <p className="look-field__hint">
          Tips are tagged and only <strong>suggested</strong> on other jobs — never applied
          automatically.
        </p>
        <form
          className="portal-form"
          onSubmit={(e) => {
            e.preventDefault();
            submitNewTip(new FormData(e.currentTarget));
            e.currentTarget.reset();
          }}
        >
          <label className="look-field">
            <span className="look-field__label">Tip</span>
            <textarea
              className="look-field__input look-field__input--area"
              name="text"
              rows={3}
              placeholder="e.g. Exterior stairs: always ask about galvanizing vs paint"
              required
            />
          </label>
          <label className="look-field">
            <span className="look-field__label">Tags (comma-separated)</span>
            <input
              className="look-field__input"
              name="tags"
              placeholder="product-type, customer, material"
            />
          </label>
          <label className="look-field">
            <span className="look-field__label">Source note</span>
            <input className="look-field__input" name="sourceNote" placeholder="Where this came from" />
          </label>
          <label className="look-field">
            <span className="look-field__label">Attach to workflow step (optional)</span>
            <select className="look-field__input" name="stepId" defaultValue="">
              <option value="">— Job level —</option>
              {workflowSteps.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="look-field">
            <span className="look-field__label">Optional file (demo — not stored)</span>
            <input className="look-field__input" type="file" name="file" />
          </label>
          <button className="btn btn--primary" type="submit">
            Save tip (demo)
          </button>
        </form>
        {localTips.length ? (
          <ul className="portal-plain">
            {localTips.map((tip) => (
              <li key={tip.id}>
                <strong>{tip.text}</strong>
                <p className="portal-knowledge-tags">
                  {tip.tags.map((tag) => (
                    <span key={tag} className="portal-knowledge-tag">
                      {tag}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="portal-section">
        <h2>Captured on this job</h2>
        <ul className="portal-plain">
          {capturedOnJob.length ? (
            capturedOnJob.map((item) => <li key={item}>{item}</li>)
          ) : (
            <li>Nothing in legacy capture list yet.</li>
          )}
        </ul>
      </section>

      <section className="portal-section">
        <h2>Suggestions from other jobs</h2>
        {visibleSuggestions.length ? (
          visibleSuggestions.map((tip) => (
            <article key={tip.id} className="portal-letter portal-suggestion">
              <p className="portal-list__kicker">
                From {tip.originJobName} · {tip.createdBy}
              </p>
              <p>{tip.text}</p>
              <p className="portal-knowledge-tags">
                {tip.tags.map((tag) => (
                  <span key={tag} className="portal-knowledge-tag">
                    {tag}
                  </span>
                ))}
              </p>
              {tip.fileName ? (
                <p className="look-field__hint">Attachment: {tip.fileName}</p>
              ) : null}
              <p className="portal-inline-actions">
                <button className="btn btn--primary" type="button" onClick={() => acceptTip(tip)}>
                  Accept
                </button>
                <button
                  className="btn btn--quiet portal-btn-quiet"
                  type="button"
                  onClick={() => dismissTip(tip)}
                >
                  Dismiss
                </button>
                <StatusPill tone="draft">Person decides</StatusPill>
              </p>
            </article>
          ))
        ) : (
          <p>No pending suggestions — accept or dismiss clears this list.</p>
        )}
      </section>

      {accepted.length ? (
        <section className="portal-section">
          <h2>Impact on this job (demo session)</h2>
          <p className="look-field__hint">
            Accepting adds color-coded steps and checklist lines — still{" "}
            <SuggestionBadge /> until a person confirms.
          </p>
          <h3>Workflow steps added</h3>
          <ul className="portal-steps">
            {accepted
              .filter((a) => a.workflowStep)
              .map((a) => (
                <li key={a.tipId} className="portal-step portal-step--knowledge">
                  <span>{a.workflowStep!.label}</span>
                  <StatusPill tone="assumed">From knowledge</StatusPill>
                </li>
              ))}
          </ul>
          <p>
            <Link href={`/jobs/${jobId}/workflow`}>Open workflow editor →</Link>
          </p>
          <h3>Requirements checklist lines added</h3>
          <ul className="portal-plain">
            {accepted
              .filter((a) => a.checklistLabel)
              .map((a) => (
                <li key={a.tipId} className="portal-check">
                  <SuggestionBadge />
                  <div>
                    <strong>{a.checklistLabel}</strong>
                    <p className="look-field__hint">Source: expert knowledge (accepted this session)</p>
                  </div>
                </li>
              ))}
          </ul>
          <p>
            <Link href={`/jobs/${jobId}`}>View job workspace checklist →</Link>
          </p>
        </section>
      ) : null}

      <section className="portal-section">
        <h2>Session audit (demo)</h2>
        <Link href={`/jobs/${jobId}/audit`}>Full audit log →</Link>
        {auditLog.length ? (
          <ul className="portal-plain portal-audit">
            {auditLog.map((entry) => (
              <li key={entry.id}>
                <time>{entry.at}</time> — {entry.action}: {entry.detail}
              </li>
            ))}
          </ul>
        ) : (
          <p>Add knowledge or accept a suggestion to see audit entries.</p>
        )}
      </section>

      <p>
        <Link href="/knowledge/library">Browse knowledge library by tag →</Link>
      </p>
    </div>
  );
}
