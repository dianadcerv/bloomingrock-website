"use client";

import { useEffect, useState } from "react";
import type { DemoJob } from "@/lib/portal/demo-data";
import {
  getResolutions,
  JOB_CONFLICT_UPDATED_EVENT,
  unresolvedConflictCount,
} from "@/lib/portal/job-conflicts-store";

export function JobConflictBanner({ job }: { job: DemoJob }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setCount(unresolvedConflictCount(job, getResolutions(job.id)));
    };
    refresh();
    window.addEventListener(JOB_CONFLICT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(JOB_CONFLICT_UPDATED_EVENT, refresh);
  }, [job]);

  if (!count) return null;

  return (
    <div className="portal-conflict-banner" role="alert">
      <p>
        <strong>
          {count} conflict{count === 1 ? "" : "s"} block sign-off
        </strong>
        {" — "}
        pick a value or ask the customer before sign-off.
      </p>
      <a className="portal-conflict-banner__link" href="#requirements-checklist">
        Jump to checklist
      </a>
    </div>
  );
}
