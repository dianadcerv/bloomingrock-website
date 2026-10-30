"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/portal/PortalUi";
import type { CategoryWorkflowSuggestion } from "@/lib/portal/workflow-changes";
import {
  WORKFLOW_DEMO_UPDATED_EVENT,
  acceptCategorySuggestion,
  readAcceptedCategorySuggestions,
} from "@/lib/portal/workflow-demo-store";

export function CategorySuggestionsClient({
  suggestions,
}: {
  suggestions: CategoryWorkflowSuggestion[];
}) {
  const [accepted, setAccepted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setAccepted(readAcceptedCategorySuggestions());
    refresh();
    window.addEventListener(WORKFLOW_DEMO_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WORKFLOW_DEMO_UPDATED_EVENT, refresh);
  }, []);

  if (!suggestions.length) {
    return (
      <p className="portal-muted">
        No suggested workflow adjustments yet — they appear when comments from job threads are
        promoted here.
      </p>
    );
  }

  return (
    <ul className="portal-list">
      {suggestions.map((sug) => {
        const isAccepted = accepted.includes(sug.id);
        return (
          <li key={sug.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">
                From {sug.jobName} · comment {sug.fromCommentId}
              </p>
              <h2>{sug.suggestedStepLabel}</h2>
              <p>{sug.summary}</p>
              {isAccepted ? (
                <p className="look-field__hint">
                  Accepted for category template review — editing the default workflow is Phase 2.
                </p>
              ) : null}
            </div>
            <div className="portal-list__actions">
              {isAccepted ? (
                <StatusPill tone="ok">Accepted</StatusPill>
              ) : (
                <StatusPill tone="assumed">SUGGESTED</StatusPill>
              )}
              {!isAccepted ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    acceptCategorySuggestion(sug.id);
                    setAccepted(readAcceptedCategorySuggestions());
                  }}
                >
                  Accept suggestion
                </button>
              ) : null}
              <Link className="btn btn--quiet portal-btn-quiet" href={`/jobs/${sug.jobId}/workflow`}>
                View job thread
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
