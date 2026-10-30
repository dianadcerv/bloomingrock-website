"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DashboardNotification } from "@/lib/portal/workflow-changes";
import {
  WORKFLOW_DEMO_UPDATED_EVENT,
  notificationsForEmail,
} from "@/lib/portal/workflow-demo-store";

export function EmailOutboxLive({
  email,
  initialMessages,
}: {
  email: string;
  initialMessages: DashboardNotification[];
}) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const refresh = () => setMessages(notificationsForEmail(email));
    refresh();
    window.addEventListener(WORKFLOW_DEMO_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WORKFLOW_DEMO_UPDATED_EVENT, refresh);
  }, [email]);

  const items = messages.length ? messages : initialMessages;

  if (!items.length) {
    return (
      <p>No email previews for your account — you are not on an active workflow change thread.</p>
    );
  }

  return (
    <ul className="portal-email-outbox">
      {items.map((msg) => (
        <li key={msg.id} className="portal-email-outbox__item">
          <p className="portal-email-outbox__label">Email notification (demo, not sent)</p>
          <p className="portal-email-outbox__subject">{msg.emailSubject}</p>
          <pre className="portal-email-outbox__body">{msg.emailBodyPreview}</pre>
          <p className="look-field__hint">
            To: {msg.recipientEmails.join(", ")} · <Link href={msg.href}>Open workflow</Link>
          </p>
        </li>
      ))}
    </ul>
  );
}
