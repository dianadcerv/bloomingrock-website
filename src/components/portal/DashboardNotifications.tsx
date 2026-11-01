import Link from "next/link";
import type { DashboardNotification } from "@/lib/portal/workflow-changes";

export function DashboardNotifications({ items }: { items: DashboardNotification[] }) {
  if (!items.length) return null;

  return (
    <section className="portal-dashboard-notifications" aria-labelledby="dash-notifications">
      <div className="portal-dashboard-notifications__head">
        <h2 id="dash-notifications">Notifications for you</h2>
        <Link href="/notifications/outbox">Email preview (demo)</Link>
      </div>
      <ul className="portal-dashboard-notifications__list">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href} className="portal-dashboard-notifications__item">
              <p className="portal-dashboard-notifications__title">{item.title}</p>
              <p>{item.detail}</p>
              <span className="look-field__hint">{item.jobName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
