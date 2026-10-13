"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/portal/PortalUi";
import type { PortalSession } from "@/lib/portal/session";
import { normalizeEmail } from "@/lib/portal/session";
import type {
  WorkflowChangeComment,
  WorkflowChangeProposal,
} from "@/lib/portal/workflow-changes";
import {
  notificationRecipientsForChange,
  pendingApproverEmail,
} from "@/lib/portal/workflow-changes";

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

export function WorkflowMutualPanel({
  jobId,
  session,
  initialProposals,
}: {
  jobId: string;
  session: PortalSession;
  initialProposals: WorkflowChangeProposal[];
}) {
  const [proposals, setProposals] = useState(initialProposals);
  const [rejectDraft, setRejectDraft] = useState<Record<string, string>>({});
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  const myEmail = normalizeEmail(session.email);
  const isShop = session.role === "shop";

  const canApprove = (change: WorkflowChangeProposal) => {
    if (change.status !== "pending") return false;
    const approver = pendingApproverEmail(change);
    return approver !== null && normalizeEmail(approver) === myEmail;
  };

  const canReject = (change: WorkflowChangeProposal) => canApprove(change);

  const approve = (changeId: string) => {
    setProposals((prev) =>
      prev.map((c) => {
        if (c.id !== changeId) return c;
        const shopApproved = isShop ? true : c.shopApproved;
        const customerApproved = !isShop ? true : c.customerApproved;
        const both = shopApproved && customerApproved;
        return {
          ...c,
          shopApproved,
          customerApproved,
          status: both ? "approved" : "pending",
          isNew: !both,
        };
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
    setProposals((prev) =>
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
    setProposals((prev) =>
      prev.map((c) =>
        c.id === changeId ? { ...c, comments: [...c.comments, comment] } : c,
      ),
    );
    setReplyDraft((d) => ({ ...d, [changeId]: "" }));
  };

  const visible = useMemo(() => proposals.filter((p) => p.jobId === jobId), [proposals, jobId]);

  if (!visible.length) {
    return (
      <p className="look-field__hint">No workflow change proposals on this job yet.</p>
    );
  }

  return (
    <section className="portal-wf-changes" aria-labelledby="wf-changes-heading">
      <h2 id="wf-changes-heading">Workflow change proposals</h2>
      <p className="look-field__hint">
        Either side can propose adding or removing a step. Both must approve for it to apply.
        Rejection requires a comment and stays <strong>Rejected, in discussion</strong> until you
        agree on next steps in the thread.
      </p>
      <ul className="portal-wf-changes__list">
        {visible.map((change) => (
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
            {canReject(change) ? (
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
                    placeholder="Explain why — this starts the discussion thread."
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
                  className={comment.isRejection ? "portal-wf-change__comment--rejection" : undefined}
                >
                  <p className="portal-wf-change__comment-meta">
                    <strong>{comment.authorName}</strong>
                    {comment.isRejection ? " · Rejection" : ""} · {comment.at}
                  </p>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
            {change.status === "rejected-in-discussion" || change.comments.length ? (
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
            ) : null}
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
    </section>
  );
}
