import type { Metadata } from "next";
import { PhoneIntakeForm } from "@/components/portal/PhoneIntakeForm";
import { PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopStaff } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Phone intake" };

export default async function PhoneEntryPage() {
  const session = await requireShopStaff();

  return (
    <PortalShell session={session} current="/phone-entry">
      <PageIntro eyebrow="Quick capture" title="Phone intake">
        <p>Type up a call while it&apos;s fresh — creates an inbox item with suggested customer match (demo).</p>
      </PageIntro>
      <PhoneIntakeForm createdBy={session.name} />
    </PortalShell>
  );
}
