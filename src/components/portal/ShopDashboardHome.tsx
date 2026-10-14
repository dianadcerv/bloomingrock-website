"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardNotificationsLive } from "@/components/portal/DashboardNotificationsLive";
import { OpenQuestion } from "@/components/portal/DemoNotes";
import { ModuleCard, Badge } from "@/components/portal/PortalUi";
import { SummaryMetricTile } from "@/components/portal/SummaryMetricTile";
import type { DashboardNotification } from "@/lib/portal/workflow-changes";
import type {
  AttentionRow,
  SummaryTile,
  WorkJobRow,
} from "@/lib/portal/dashboard-data";
import {
  CUSTOMER_FILTER_OPTIONS,
  groupJobsByStage,
} from "@/lib/portal/dashboard-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

function attentionBadgeTone(tone: AttentionRow["tone"]) {
  if (tone === "conflict") return "critical" as const;
  if (tone === "ok") return "success" as const;
  if (tone === "missing") return "info" as const;
  return "neutral" as const;
}

function WipMobileList({ jobs }: { jobs: WorkJobRow[] }) {
  return (
    <ul className="portal-wip-mobile-list">
      {jobs.map((job) => (
        <li key={job.jobId}>
          <Link href={`/jobs/${job.jobId}`} className="portal-wip-mobile-list__link">
            <div className="portal-wip-mobile-list__head">
              <span className="portal-wip-mobile-list__job">{job.jobName}</span>
              <Badge tone={job.tone === "conflict" ? "critical" : job.tone === "ok" ? "success" : "info"}>
                {job.statusLabel}
              </Badge>
            </div>
            <p className="portal-wip-mobile-list__meta">
              {job.customer} · {job.project} · {job.ownerRole} · since {job.stageSince}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ShopDashboardHome({
  firstName,
  email,
  notifications,
  summaryTiles,
  attention,
  workJobs,
  recentActivity,
  navModules,
}: {
  firstName: string;
  email: string;
  notifications: DashboardNotification[];
  summaryTiles: SummaryTile[];
  attention: AttentionRow[];
  workJobs: WorkJobRow[];
  recentActivity: {
    id: string;
    at: string;
    who: string;
    action: string;
    detail: string;
    jobId: string;
    jobName: string;
  }[];
  navModules: { href: string; eyebrow: string; title: string; body: string }[];
}) {
  const [customerFilter, setCustomerFilter] = useState("all");
  const [wipView, setWipView] = useState<"board" | "table">("board");

  const filteredJobs = useMemo(
    () =>
      customerFilter === "all"
        ? workJobs
        : workJobs.filter((j) => j.customerId === customerFilter),
    [workJobs, customerFilter],
  );

  const board = useMemo(() => groupJobsByStage(filteredJobs), [filteredJobs]);

  return (
    <div className="portal-dashboard">
      <header className="portal-dashboard__hero">
        <div>
          <p className="portal-intro__eyebrow">Northridge Steel · Shop home</p>
          <h1 className="portal-intro__title">Good morning, {firstName}</h1>
          <p className="portal-dashboard__lede">What needs you today?</p>
        </div>
      </header>

      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.statusNames}</OpenQuestion>

      <DashboardNotificationsLive email={email} initialItems={notifications} />

      <section className="portal-dashboard__section" aria-labelledby="dash-glance-heading">
        <h2 id="dash-glance-heading" className="portal-dashboard__mini-head">
          At a glance
        </h2>
        <div className="portal-dashboard-metrics">
          {summaryTiles.map((tile) => (
            <SummaryMetricTile key={tile.id} {...tile} />
          ))}
        </div>
      </section>

      <section className="portal-dashboard__section" aria-labelledby="dash-shortcuts-heading">
        <h2 id="dash-shortcuts-heading" className="portal-dashboard__mini-head">
          Workspace shortcuts
        </h2>
        <div className="portal-dashboard-nav-row">
          {navModules.map((mod) => (
            <ModuleCard key={mod.href + mod.title} variant="nav" {...mod} />
          ))}
        </div>
      </section>

      <div className="portal-dashboard__layout">
        <div className="portal-dashboard__layout-primary">
          <section className="portal-dashboard__section">
            <div className="portal-dashboard__section-head">
              <h2>Needs your attention</h2>
              <Link href="/attention" className="portal-link-quiet">
                View all
              </Link>
            </div>
            <ul className="portal-attention-compact">
              {attention.map((row) => (
                <li key={row.id}>
                  <Link href={row.href} className="portal-attention-compact__row">
                    <Badge tone={attentionBadgeTone(row.tone)}>{row.statusLabel}</Badge>
                    <span className="portal-attention-compact__job">{row.title}</span>
                    <span className="portal-attention-compact__action">{row.actionLabel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="portal-dashboard__section">
            <div className="portal-dashboard__section-head">
              <h2>Work in progress</h2>
              <div className="portal-dashboard__controls">
                <label className="portal-dashboard__filter">
                  <span className="look-field__hint">Customer</span>
                  <select
                    className="look-field__input"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  >
                    {CUSTOMER_FILTER_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div
                  className="portal-segmented portal-segmented--wip"
                  role="tablist"
                  aria-label="Work in progress layout"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={wipView === "board"}
                    className={wipView === "board" ? "is-active" : undefined}
                    onClick={() => setWipView("board")}
                  >
                    Board
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={wipView === "table"}
                    className={wipView === "table" ? "is-active" : undefined}
                    onClick={() => setWipView("table")}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>

            <WipMobileList jobs={filteredJobs} />

            {wipView === "board" ? (
              <div className="portal-wip-board">
                {board.map(([stage, jobs]) => (
                  <div key={stage} className="portal-wip-column">
                    <h3>{stage}</h3>
                    <ul>
                      {jobs.map((job) => (
                        <li key={job.jobId}>
                          <Link href={`/jobs/${job.jobId}`} className="portal-wip-card">
                            <p className="portal-wip-card__customer">{job.customer}</p>
                            <p className="portal-wip-card__job">{job.jobName}</p>
                            <p className="look-field__hint">
                              {job.project} · {job.ownerRole} · since {job.stageSince}
                            </p>
                            <Badge tone={job.tone === "conflict" ? "critical" : job.tone === "ok" ? "success" : "info"}>
                              {job.statusLabel}
                            </Badge>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <table className="portal-table portal-wip-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Project</th>
                    <th>Job</th>
                    <th>Owner role</th>
                    <th>Status</th>
                    <th>In stage since</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.jobId}>
                      <td>{job.customer}</td>
                      <td>{job.project}</td>
                      <td>
                        <Link href={`/jobs/${job.jobId}`}>{job.jobName}</Link>
                      </td>
                      <td>{job.ownerRole}</td>
                      <td>
                        <Badge tone={job.tone === "conflict" ? "critical" : job.tone === "ok" ? "success" : "info"}>
                          {job.statusLabel}
                        </Badge>
                      </td>
                      <td>{job.stageSince}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <aside className="portal-dashboard__layout-aside">
          <section className="portal-dashboard__section">
            <div className="portal-dashboard__section-head">
              <h2>Recent activity</h2>
              <Link href="/activity" className="portal-link-quiet">
                View all
              </Link>
            </div>
            <ul className="portal-plain portal-audit">
              {recentActivity.map((entry) => (
                <li key={entry.id}>
                  <time>{entry.at}</time>
                  <strong>{entry.who}</strong> — {entry.action} ·{" "}
                  <Link href={`/jobs/${entry.jobId}/audit`}>{entry.jobName}</Link>
                  <p>{entry.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section className="portal-dashboard__section portal-dashboard__quick">
        <h2>Quick actions</h2>
        <div className="portal-inline-actions">
          <Link className="btn btn--primary" href="/customers">
            New job
          </Link>
          <Link className="btn btn--quiet portal-btn-quiet" href="/jobs/access-platform/transcript">
            Upload transcript
          </Link>
          <Link className="btn btn--quiet portal-btn-quiet" href="/jobs/access-platform/knowledge">
            Add expert tip
          </Link>
        </div>
      </section>
    </div>
  );
}
