import Link from "next/link";
import { DashboardNotificationsLive } from "@/components/portal/DashboardNotificationsLive";
import { OpenQuestion, StatusPill } from "@/components/portal/PortalUi";
import { SummaryMetricTile } from "@/components/portal/SummaryMetricTile";
import type { DashboardNotification } from "@/lib/portal/workflow-changes";
import type { AttentionRow, SummaryTile, WorkJobRow } from "@/lib/portal/dashboard-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export function CustomerDashboardHome({
  firstName,
  org,
  email,
  notifications,
  summaryTiles,
  waiting,
  jobs,
}: {
  firstName: string;
  org: string;
  email: string;
  notifications: DashboardNotification[];
  summaryTiles: SummaryTile[];
  waiting: AttentionRow[];
  jobs: WorkJobRow[];
}) {
  return (
    <div className="portal-dashboard portal-dashboard--customer">
      <header className="portal-dashboard__hero">
        <p className="portal-intro__eyebrow">{org}</p>
        <h1 className="portal-intro__title">Hello, {firstName}</h1>
        <p className="portal-dashboard__lede">Your jobs and anything waiting on you.</p>
      </header>

      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.statusNames}</OpenQuestion>

      <DashboardNotificationsLive email={email} initialItems={notifications} />

      <section className="portal-dashboard__section" aria-labelledby="customer-overview-heading">
        <h2 id="customer-overview-heading" className="portal-dashboard__mini-head">
          Overview
        </h2>
        <div className="portal-dashboard-metrics portal-dashboard-metrics--customer">
          {summaryTiles.map((tile) => (
            <SummaryMetricTile key={tile.id} {...tile} />
          ))}
        </div>
      </section>

      <section className="portal-dashboard__section" id="waiting-on-you">
        <div className="portal-dashboard__section-head">
          <h2>Waiting on you</h2>
          <Link href="/requests">Requests</Link>
        </div>
        {waiting.length ? (
          <ul className="portal-attention-list">
            {waiting.map((row) => (
              <li key={row.id} className="portal-attention-list__item">
                <div className="portal-attention-list__body">
                  <p className="portal-attention-list__title">{row.title}</p>
                  <p className="portal-attention-list__detail">{row.detail}</p>
                  <StatusPill tone={row.tone}>{row.statusLabel}</StatusPill>
                </div>
                <Link className="btn btn--primary portal-attention-list__action" href={row.href}>
                  {row.actionLabel}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nothing needs your action right now.</p>
        )}
      </section>

      <section className="portal-dashboard__section">
        <div className="portal-dashboard__section-head">
          <h2>Your jobs</h2>
          <Link href="/jobs">View all</Link>
        </div>
        <ul className="portal-list">
          {jobs.map((job) => (
            <li key={job.jobId} className="portal-list__item">
              <div>
                <h3>{job.jobName}</h3>
                <p className="look-field__hint">{job.project}</p>
              </div>
              <div className="portal-list__actions">
                <StatusPill tone={job.tone}>{job.statusLabel}</StatusPill>
                <Link className="btn btn--primary" href={`/jobs/${job.jobId}`}>
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
