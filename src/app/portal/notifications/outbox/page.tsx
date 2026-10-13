import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { getEmailOutboxForEmail } from "@/lib/portal/workflow-changes";

export const metadata: Metadata = { title: "Notification outbox (demo)" };

export default async function NotificationOutboxPage() {
  const session = await requireSession();
  const messages = getEmailOutboxForEmail(session.email);

  return (
    <PortalShell session={session} current="/dashboard">
      <PageIntro eyebrow="Demo only" title="Email notification outbox">
        <p>
          Emails are <strong>not sent</strong>. You only see previews for workflow threads you
          participate in (proposer, commenter, or pending approver).
        </p>
      </PageIntro>
      {messages.length ? (
        <ul className="portal-email-outbox">
          {messages.map((msg) => (
            <li key={msg.id} className="portal-email-outbox__item">
              <p className="portal-email-outbox__label">Email notification (demo, not sent)</p>
              <p className="portal-email-outbox__subject">{msg.emailSubject}</p>
              <pre className="portal-email-outbox__body">{msg.emailBodyPreview}</pre>
              <p className="look-field__hint">
                To: {msg.recipientEmails.join(", ")} ·{" "}
                <Link href={msg.href}>Open workflow</Link>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No email previews for your account — you are not on an active workflow change thread.</p>
      )}
      <p>
        <Link href="/dashboard">← Back to home</Link>
      </p>
    </PortalShell>
  );
}
