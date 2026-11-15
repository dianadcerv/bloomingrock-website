import type { Metadata } from "next";
import { InboxListClient } from "@/components/portal/InboxListClient";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { inboxForSession } from "@/lib/portal/access";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const session = await requireShopStaff();

  return (
    <PortalShell session={session} current="/inbox">
      <PageIntro eyebrow="Shop home" title="Inbox">
        <p>
          Grouped by suggested customer. Confirm, reassign, or forward before anything is filed.
          Customer uploads and website forms appear here too (demo).
        </p>
      </PageIntro>
      <InboxListClient seedItems={inboxForSession(session)} />
    </PortalShell>
  );
}
