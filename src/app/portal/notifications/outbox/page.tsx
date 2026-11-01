import type { Metadata } from "next";
import Link from "next/link";
import { EmailOutboxLive } from "@/components/portal/EmailOutboxLive";
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
      <EmailOutboxLive email={session.email} initialMessages={messages} />
      <p>
        <Link href="/dashboard">← Back to home</Link>
      </p>
    </PortalShell>
  );
}
