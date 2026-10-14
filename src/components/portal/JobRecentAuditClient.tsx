"use client";

import { useEffect, useMemo, useState } from "react";
import type { DemoJob } from "@/lib/portal/demo-data";
import {
  getConflictAudit,
  JOB_CONFLICT_UPDATED_EVENT,
  type ConflictAuditEntry,
} from "@/lib/portal/job-conflicts-store";

type SeedEntry = DemoJob["auditLog"][number];

export function JobRecentAuditClient({
  jobId,
  seed,
}: {
  jobId: string;
  seed: SeedEntry[];
}) {
  const [extra, setExtra] = useState<ConflictAuditEntry[]>([]);

  useEffect(() => {
    const refresh = () => setExtra(getConflictAudit(jobId));
    refresh();
    window.addEventListener(JOB_CONFLICT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(JOB_CONFLICT_UPDATED_EVENT, refresh);
  }, [jobId]);

  const rows = useMemo(() => {
    const merged = [
      ...extra.map((e) => ({ id: e.id, at: e.at, action: e.action, detail: e.detail })),
      ...seed.map((e) => ({ id: e.id, at: e.at, action: e.action, detail: e.detail })),
    ];
    return merged.slice(0, 5);
  }, [extra, seed]);

  return (
    <ul className="portal-plain portal-audit">
      {rows.map((entry) => (
        <li key={entry.id}>
          <time dateTime={entry.at}>{entry.at}</time> — {entry.action}: {entry.detail}
        </li>
      ))}
    </ul>
  );
}
