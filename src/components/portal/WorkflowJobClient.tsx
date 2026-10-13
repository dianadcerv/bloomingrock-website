"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { OpenQuestion, StatusPill } from "@/components/portal/PortalUi";
import { ProvenanceLegend, ProvenanceMarks } from "@/components/portal/ProvenanceMarkers";
import type { AuditEntry, WorkflowStep } from "@/lib/portal/demo-data";
import { DEMO_SHOP_ROLES, PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";
import type { PortalSession } from "@/lib/portal/session";
import { normalizeEmail } from "@/lib/portal/session";
import type {
  WorkflowChangeComment,
  WorkflowChangeProposal,
  WorkflowStepComment,
} from "@/lib/portal/workflow-changes";
import {
  notificationRecipientsForChange,
  pendingApproverEmail,
} from "@/lib/portal/workflow-changes";
import {
  appendAuditEntry,
  applyProposalsToSteps,
  createProposalId,
  getMergedProposals,
  mergeKnowledgeSteps,
  proposerApprovals,
  proposalsForJobMerged,
  readStepComments,
  writeStepComments,
  writeStoredProposals,
  type WorkflowDisplayItem,
} from "@/lib/portal/workflow-demo-store";

function newAudit(who: string, action: string, detail: string, seq: number): AuditEntry {
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

function statusPill(change: WorkflowChangeProposal) {
  if (change.status === "approved") {
    return <StatusPill tone="ok">Approved</StatusPill>;
  }
  if (change.status === "rejected-in-discussion") {
    return <StatusPill tone="conflict">Rejected, in discussion</StatusPill>;
  }
  if (change.isNew) {
    return <StatusPill tone="assumed">NEW · pending approval</StatusPill>;
  }
  return <StatusPill tone="draft">Pending approval</StatusPill>;
}

function flattenSteps(items: WorkflowDisplayItem[]): WorkflowStep[] {
  return items.filter((i): i is Extract<WorkflowDisplayItem, { type: "step" }> => i.type === "step").map((i) => i.step);
}

export function WorkflowJobClient({
  jobId,
  jobName,
  session,
  initialSteps,
}: {
  jobId: string;
  jobName: string;
  session: PortalSession;
  initialSteps: WorkflowStep[];
}) {
  const isShop = session.role === "shop";
  const myEmail = normalizeEmail(session.email);
  const mySide = isShop ? "shop" : "customer";
  const auditSeq = useRef(0);

  const [proposals, setProposals] = useState<WorkflowChangeProposal[]>(() =>
    proposalsForJobMerged(jobId),
  );
  const commentSeq = useRef(0);
  const [stepComments, setStepComments] = useState<Record<string, WorkflowStepComment[]>>(() =>
    readStepComments(jobId),
  );
  const [stepCommentDraft, setStepCommentDraft] = useState<Record<string, string>>({});
  const [rejectDraft, setRejectDraft] = useState<Record<string, string>>({});
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [proposeKind, setProposeKind] = useState<"add-step" | "remove-step">("add-step");
  const [proposeLabel, setProposeLabel] = useState("");
  const [proposeRemoveId, setProposeRemoveId] = useState("");
  const [proposeComment, setProposeComment] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialSteps[0]?.id ?? null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [sessionAudit, setSessionAudit] = useState<AuditEntry[]>([]);

  const baseSteps = useMemo(
    () => mergeKnowledgeSteps(jobId, initialSteps.map((s) => ({ ...s }))),
    [jobId, initialSteps],
  );

  const syncStepsFromProposals = useCallback(
    (next: WorkflowChangeProposal[]) =>
      flattenSteps(applyProposalsToSteps(jobId, baseSteps, next)),
    [jobId, baseSteps],
  );

  const [orderedSteps, setOrderedSteps] = useState<WorkflowStep[]>(() =>
    flattenSteps(
      applyProposalsToSteps(jobId, mergeKnowledgeSteps(jobId, initialSteps.map((s) => ({ ...s }))), proposalsForJobMerged(jobId)),
    ),
  );

  const persistProposals = useCallback(
    (nextJobProposals: WorkflowChangeProposal[]) => {
      const all = getMergedProposals();
      const other = all.filter((p) => p.jobId !== jobId);
      const merged = [...other, ...nextJobProposals];
      writeStoredProposals(merged);
      setProposals(nextJobProposals);
      setOrderedSteps(syncStepsFromProposals(nextJobProposals));
    },
    [jobId, syncStepsFromProposals],
  );

  const pushAudit = useCallback(
    (action: string, detail: string) => {
      const entry = newAudit(session.name, action, detail, auditSeq.current++);
      setSessionAudit((prev) => [entry, ...prev]);
      appendAuditEntry(jobId, entry);
    },
    [jobId, session.name],
  );

  const displayItems = useMemo(
    () => applyProposalsToSteps(jobId, baseSteps, proposals),
    [jobId, baseSteps, proposals],
  );

  const displayItemsWithOrder = useMemo(() => {
    const pendingAdds = displayItems.filter(
      (i): i is Extract<WorkflowDisplayItem, { type: "pending-add" }> => i.type === "pending-add",
    );
    const stepMap = new Map(orderedSteps.map((s) => [s.id, s]));
    const ordered: WorkflowDisplayItem[] = [];
    for (const step of orderedSteps) {
      const meta = displayItems.find(
        (i) => i.type === "step" && i.step.id === step.id,
      ) as Extract<WorkflowDisplayItem, { type: "step" }> | undefined;
      if (!meta) continue;
      ordered.push({ ...meta, step: stepMap.get(step.id) ?? meta.step });
    }
    return [...ordered, ...pendingAdds];
  }, [displayItems, orderedSteps]);

  const removableSteps = useMemo(
    () => orderedSteps.filter((s) => s.kind !== "minimum"),
    [orderedSteps],
  );

  const selected = orderedSteps.find((s) => s.id === selectedId) ?? null;

  const canApprove = (change: WorkflowChangeProposal) => {
    if (change.status !== "pending") return false;
    const approver = pendingApproverEmail(change);
    return approver !== null && normalizeEmail(approver) === myEmail;
  };

  const saveAllProposals = (updater: (prev: WorkflowChangeProposal[]) => WorkflowChangeProposal[]) => {
    persistProposals(updater(proposals));
  };

  const approve = (changeId: string) => {
    saveAllProposals((prev) =>
      prev.map((c) => {
        if (c.id !== changeId) return c;
        const shopApproved = isShop ? true : c.shopApproved;
        const customerApproved = !isShop ? true : c.customerApproved;
        const both = shopApproved && customerApproved;
        const next = {
          ...c,
          shopApproved,
          customerApproved,
          status: both ? ("approved" as const) : ("pending" as const),
          isNew: !both,
        };
        pushAudit(
          both ? "Workflow change approved" : "Workflow change partially approved",
          `${c.kind === "add-step" ? c.stepLabel : c.targetStepLabel} on ${jobName}`,
        );
        return next;
      }),
    );
  };

  const rejectWithComment = (changeId: string) => {
    const body = rejectDraft[changeId]?.trim();
    if (!body) return;
    const comment: WorkflowChangeComment = {
      id: `c-rej-${Date.now()}`,
      at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
      authorName: session.name,
      authorEmail: session.email,
      body,
      isRejection: true,
    };
    saveAllProposals((prev) =>
      prev.map((c) =>
        c.id === changeId
          ? {
              ...c,
              status: "rejected-in-discussion",
              isNew: false,
              comments: [...c.comments, comment],
            }
          : c,
      ),
    );
    pushAudit("Workflow change rejected", body);
    setRejectDraft((d) => ({ ...d, [changeId]: "" }));
  };

  const addReply = (changeId: string) => {
    const body = replyDraft[changeId]?.trim();
    if (!body) return;
    const comment: WorkflowChangeComment = {
      id: `c-reply-${Date.now()}`,
      at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
      authorName: session.name,
      authorEmail: session.email,
      body,
    };
    saveAllProposals((prev) =>
      prev.map((c) =>
        c.id === changeId ? { ...c, comments: [...c.comments, comment] } : c,
      ),
    );
    pushAudit("Workflow thread comment", body.slice(0, 80));
    setReplyDraft((d) => ({ ...d, [changeId]: "" }));
  };

  const submitProposal = () => {
    const commentBody = proposeComment.trim();
    if (!commentBody) return;
    if (proposeKind === "add-step" && !proposeLabel.trim()) return;
    if (proposeKind === "remove-step" && !proposeRemoveId) return;

    const id = createProposalId();
    const approvals = proposerApprovals(mySide);
    const proposal: WorkflowChangeProposal = {
      id,
      jobId,
      kind: proposeKind,
      status: "pending",
      isNew: true,
      proposerSide: mySide,
      proposerName: session.name,
      proposerEmail: session.email,
      ...approvals,
      stepLabel: proposeKind === "add-step" ? proposeLabel.trim() : "",
      targetStepId: proposeKind === "remove-step" ? proposeRemoveId : undefined,
      targetStepLabel:
        proposeKind === "remove-step"
          ? orderedSteps.find((s) => s.id === proposeRemoveId)?.label
          : undefined,
      comments: [
        {
          id: `c-prop-${Date.now()}`,
          at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
          authorName: session.name,
          authorEmail: session.email,
          body: commentBody,
        },
      ],
      createdAt: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
    };
    saveAllProposals((prev) => [...prev, proposal]);
    pushAudit(
      "Proposed workflow change",
      proposeKind === "add-step" ? `Add: ${proposeLabel}` : `Remove: ${proposal.targetStepLabel}`,
    );
    setProposeLabel("");
    setProposeComment("");
    setProposeRemoveId("");
  };

  const addStepComment = (stepId: string) => {
    const body = stepCommentDraft[stepId]?.trim();
    if (!body) return;
    const comment: WorkflowStepComment = {
      id: `sc-${commentSeq.current++}`,
      stepId,
      at: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT",
      authorName: session.name,
      authorEmail: session.email,
      body,
    };
    const next = {
      ...stepComments,
      [stepId]: [...(stepComments[stepId] ?? []), comment],
    };
    setStepComments(next);
    writeStepComments(jobId, next);
    pushAudit("Comment on workflow step", `"${orderedSteps.find((s) => s.id === stepId)?.label}" — ${body.slice(0, 60)}`);
    setStepCommentDraft((d) => ({ ...d, [stepId]: "" }));
  };

  const updateSelected = (patch: Partial<WorkflowStep>) => {
    if (!selectedId || !isShop) return;
    setOrderedSteps((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)),
    );
  };

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId || !isShop) return;
    setOrderedSteps((prev) => {
      const from = prev.findIndex((s) => s.id === dragId);
      const to = prev.findIndex((s) => s.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    pushAudit("Moved workflow step", `Reordered steps on ${jobName} (demo).`);
    setDragId(null);
  };

  return (
    <div className="portal-workflow-job">
      <ProvenanceLegend />
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.interpretationAccuracyHarness}</OpenQuestion>

      <section className="portal-wf-changes" aria-labelledby="wf-changes-heading">
        <h2 id="wf-changes-heading">Workflow change proposals</h2>
        <p className="look-field__hint">
          Either side can propose adding or removing a step. Both must approve before it applies.
          Rejection requires a comment and stays <strong>Rejected, in discussion</strong>.
        </p>

        <div className="portal-wf-propose">
          <h3>Propose a change</h3>
          <div className="portal-wf-propose__row">
            <label className="look-field">
              <span className="look-field__label">Change type</span>
              <select
                className="look-field__input"
                value={proposeKind}
                onChange={(e) => setProposeKind(e.target.value as "add-step" | "remove-step")}
              >
                <option value="add-step">Add a step</option>
                <option value="remove-step">Remove a step</option>
              </select>
            </label>
            {proposeKind === "add-step" ? (
              <label className="look-field">
                <span className="look-field__label">New step name</span>
                <input
                  className="look-field__input"
                  value={proposeLabel}
                  onChange={(e) => setProposeLabel(e.target.value)}
                  placeholder="e.g. Customer QA review"
                />
              </label>
            ) : (
              <label className="look-field">
                <span className="look-field__label">Step to remove</span>
                <select
                  className="look-field__input"
                  value={proposeRemoveId}
                  onChange={(e) => setProposeRemoveId(e.target.value)}
                >
                  <option value="">Select…</option>
                  {removableSteps.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <label className="look-field">
            <span className="look-field__label">Opening comment (required)</span>
            <textarea
              className="look-field__input look-field__input--area"
              rows={2}
              value={proposeComment}
              onChange={(e) => setProposeComment(e.target.value)}
              placeholder="Why this change — both sides see this thread."
            />
          </label>
          <button
            type="button"
            className="btn btn--primary"
            disabled={
              !proposeComment.trim() ||
              (proposeKind === "add-step" ? !proposeLabel.trim() : !proposeRemoveId)
            }
            onClick={submitProposal}
          >
            Submit proposal
          </button>
        </div>

        {proposals.length ? (
          <ul className="portal-wf-changes__list">
            {proposals.map((change) => (
              <li
                key={change.id}
                id={`change-${change.id}`}
                className={`portal-wf-change${
                  change.isNew ? " portal-wf-change--new" : ""
                }${change.status === "rejected-in-discussion" ? " portal-wf-change--rejected" : ""}`}
              >
                <div className="portal-wf-change__head">
                  <div>
                    {statusPill(change)}
                    <p className="portal-wf-change__title">
                      {change.kind === "add-step"
                        ? `Add step: ${change.stepLabel}`
                        : `Remove step: ${change.targetStepLabel}`}
                    </p>
                    <p className="look-field__hint">
                      Proposed by {change.proposerName} ({change.proposerSide}) · {change.createdAt}
                    </p>
                  </div>
                  <div className="portal-wf-change__actions">
                    {canApprove(change) ? (
                      <button
                        type="button"
                        className="btn btn--primary portal-wf-change__approve"
                        onClick={() => approve(change.id)}
                      >
                        ✓ Approve
                      </button>
                    ) : null}
                  </div>
                </div>
                {canApprove(change) ? (
                  <div className="portal-wf-change__reject">
                    <label className="look-field">
                      <span className="look-field__label">Reject (comment required)</span>
                      <textarea
                        className="look-field__input look-field__input--area"
                        rows={2}
                        value={rejectDraft[change.id] ?? ""}
                        onChange={(e) =>
                          setRejectDraft((d) => ({ ...d, [change.id]: e.target.value }))
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn--quiet portal-btn-quiet"
                      disabled={!rejectDraft[change.id]?.trim()}
                      onClick={() => rejectWithComment(change.id)}
                    >
                      Reject with comment
                    </button>
                  </div>
                ) : null}
                {change.status === "pending" ? (
                  <div className="portal-wf-change__approvals">
                    <span className={change.shopApproved ? "is-done" : undefined}>
                      Shop {change.shopApproved ? "✓" : "—"}
                    </span>
                    <span className={change.customerApproved ? "is-done" : undefined}>
                      Customer {change.customerApproved ? "✓" : "—"}
                    </span>
                  </div>
                ) : null}
                <ul className="portal-wf-change__comments">
                  {change.comments.map((comment) => (
                    <li
                      key={comment.id}
                      className={
                        comment.isRejection ? "portal-wf-change__comment--rejection" : undefined
                      }
                    >
                      <p className="portal-wf-change__comment-meta">
                        <strong>{comment.authorName}</strong>
                        {comment.isRejection ? " · Rejection" : ""} · {comment.at}
                      </p>
                      <p>{comment.body}</p>
                    </li>
                  ))}
                </ul>
                <div className="portal-wf-change__reply">
                  <label className="look-field">
                    <span className="look-field__label">Add to thread</span>
                    <textarea
                      className="look-field__input look-field__input--area"
                      rows={2}
                      value={replyDraft[change.id] ?? ""}
                      onChange={(e) =>
                        setReplyDraft((d) => ({ ...d, [change.id]: e.target.value }))
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={!replyDraft[change.id]?.trim()}
                    onClick={() => addReply(change.id)}
                  >
                    Post comment
                  </button>
                </div>
                <p className="look-field__hint portal-wf-change__notify-hint">
                  Notified on this thread:{" "}
                  {notificationRecipientsForChange(change)
                    .map((e) => e.split("@")[0])
                    .join(", ")}
                  . Others with job access are not notified (audit log only).
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="look-field__hint">No proposals on this job yet — use the form above.</p>
        )}
      </section>

      <section className="portal-workflow-editor">
        <h2>Workflow steps</h2>
        <p className="look-field__hint">
          {isShop
            ? "Reorder and edit details here. Adding or removing steps requires mutual approval above."
            : "Propose changes above. Comment on any step below — both sides see the thread."}
        </p>
        {isShop ? (
          <p className="portal-inline-actions">
            <Link className="btn btn--quiet portal-btn-quiet" href={`/jobs/${jobId}/knowledge`}>
              Add expert knowledge →
            </Link>
            <Link className="btn btn--quiet portal-btn-quiet" href="/knowledge/library">
              Knowledge library
            </Link>
          </p>
        ) : null}

        <div className={isShop ? "portal-workflow-layout" : undefined}>
          <ol className={`portal-steps${isShop ? " portal-steps--editor" : ""}`}>
            {displayItemsWithOrder.map((item) => {
              if (item.type === "pending-add") {
                const p = item.proposal;
                return (
                  <li
                    key={p.id}
                    className="portal-step portal-step--added portal-step--pending-add portal-wf-change--new"
                  >
                    <span>{p.stepLabel}</span>
                    <StatusPill tone="assumed">NEW · pending approval</StatusPill>
                  </li>
                );
              }
              const step = item.step;
              return (
                <li
                  key={step.id}
                  className={`portal-step ${stepKindClass(step.kind)}${
                    item.pendingRemoval ? " portal-step--pending-remove" : ""
                  }${selectedId === step.id && isShop ? " is-selected" : ""}`}
                  draggable={isShop && !item.pendingRemoval}
                  onDragStart={() => isShop && setDragId(step.id)}
                  onDragOver={(e) => isShop && e.preventDefault()}
                  onDrop={() => onDrop(step.id)}
                >
                  {isShop ? (
                    <button type="button" className="portal-step__drag" aria-label="Drag to reorder">
                      ⋮⋮
                    </button>
                  ) : null}
                  {isShop ? (
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
                  ) : (
                    <span>{step.label}</span>
                  )}
                  {item.pendingRemoval ? (
                    <StatusPill tone="draft">Pending removal</StatusPill>
                  ) : (
                    <StatusPill
                      tone={
                        step.kind === "added" || step.kind === "knowledge-added"
                          ? "assumed"
                          : step.done
                            ? "ok"
                            : "draft"
                      }
                    >
                      {stepKindLabel(step.kind)}
                    </StatusPill>
                  )}
                  <ProvenanceMarks marks={step.provenance ?? []} jobId={jobId} />
                  <details className="portal-step-comments">
                    <summary>
                      Comments ({(stepComments[step.id] ?? []).length})
                    </summary>
                    <ul className="portal-wf-change__comments">
                      {(stepComments[step.id] ?? []).map((c) => (
                        <li key={c.id}>
                          <p className="portal-wf-change__comment-meta">
                            <strong>{c.authorName}</strong> · {c.at}
                          </p>
                          <p>{c.body}</p>
                        </li>
                      ))}
                    </ul>
                    <label className="look-field">
                      <span className="look-field__label">Add comment</span>
                      <textarea
                        className="look-field__input look-field__input--area"
                        rows={2}
                        value={stepCommentDraft[step.id] ?? ""}
                        onChange={(e) =>
                          setStepCommentDraft((d) => ({ ...d, [step.id]: e.target.value }))
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn--primary"
                      disabled={!stepCommentDraft[step.id]?.trim()}
                      onClick={() => addStepComment(step.id)}
                    >
                      Post comment
                    </button>
                  </details>
                </li>
              );
            })}
          </ol>

          {isShop ? (
            <aside className="portal-step-detail">
              <h3>Step details</h3>
              {selected ? (
                <form className="portal-form" onSubmit={(e) => e.preventDefault()}>
                  <label className="look-field">
                    <span className="look-field__label">Name</span>
                    <input
                      className="look-field__input"
                      value={selected.label}
                      onChange={(e) => updateSelected({ label: e.target.value })}
                    />
                  </label>
                  <label className="look-field">
                    <span className="look-field__label">Owner role</span>
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
                    <span className="look-field__label">Notes</span>
                    <textarea
                      className="look-field__input look-field__input--area"
                      rows={3}
                      value={selected.notes ?? ""}
                      onChange={(e) => updateSelected({ notes: e.target.value })}
                    />
                  </label>
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={() =>
                      pushAudit("Edited workflow step", `"${selected.label}" details (demo).`)
                    }
                  >
                    Save step (demo audit)
                  </button>
                </form>
              ) : (
                <p>Select a step to edit details.</p>
              )}
            </aside>
          ) : null}
        </div>
      </section>

      <section className="portal-section">
        <h2>Session audit (demo)</h2>
        <p className="look-field__hint">
          Every proposal, approval, rejection, and comment is logged.{" "}
          {isShop ? (
            <Link href={`/jobs/${jobId}/audit`}>Full audit log →</Link>
          ) : (
            "Shop users see the full job audit log."
          )}
        </p>
        {sessionAudit.length ? (
          <ul className="portal-plain portal-audit">
            {sessionAudit.map((entry) => (
              <li key={entry.id}>
                <time>{entry.at}</time>
                <strong>{entry.who}</strong> — {entry.action}
                <p>{entry.detail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workflow actions yet this session.</p>
        )}
      </section>
    </div>
  );
}
