"use client";

import { useEffect, useState } from "react";
import { DashboardNotifications } from "@/components/portal/DashboardNotifications";
import type { DashboardNotification } from "@/lib/portal/workflow-changes";
import {
  WORKFLOW_DEMO_UPDATED_EVENT,
  notificationsForEmail,
} from "@/lib/portal/workflow-demo-store";

export function DashboardNotificationsLive({
  email,
  initialItems,
}: {
  email: string;
  initialItems: DashboardNotification[];
}) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const refresh = () => setItems(notificationsForEmail(email));
    refresh();
    window.addEventListener(WORKFLOW_DEMO_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WORKFLOW_DEMO_UPDATED_EVENT, refresh);
  }, [email]);

  return <DashboardNotifications items={items.length ? items : initialItems} />;
}
