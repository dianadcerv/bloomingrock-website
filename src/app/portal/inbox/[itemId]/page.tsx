import type { Metadata } from "next";
import Link from "next/link";
import { InboxDetailClient } from "@/components/portal/InboxDetailClient";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";
import { getInboxItem } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Inbox message" };

export default async function InboxDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const session = await requireShopStaff();
  const { itemId } = await params;
  const seed = getInboxItem(itemId);

  return (
    <PortalShell session={session} current="/inbox">
      <PageIntro eyebrow="Inbox" title={seed?.subject ?? "Inbox item"}>
        <p>{seed?.from ?? "Customer submission"}</p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.ocrTool}</OpenQuestion>
      <InboxDetailClient itemId={itemId} seed={seed} sessionName={session.name} />
      <p>
        <StatusPill tone="draft">Needs confirm</StatusPill>
      </p>
      <p>
        <Link href="/inbox">← Back to inbox</Link>
      </p>
    </PortalShell>
  );
}
