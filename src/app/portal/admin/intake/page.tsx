import type { Metadata } from "next";
import { AdminIntakeEmbedClient } from "@/components/portal/AdminIntakeEmbedClient";
import { AdminShell } from "@/components/portal/AdminShell";
import { PageIntro } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Website intake" };

export default async function AdminIntakePage() {
  const session = await requireShopAdmin();

  return (
    <AdminShell session={session} current="/admin/intake">
      <PageIntro eyebrow="Shop admin" title="Quote request form">
        <p>
          Embed on your shop website. Submissions appear in{" "}
          <strong>Inbox</strong> as new requests — no prices in this demo.
        </p>
      </PageIntro>
      <AdminIntakeEmbedClient />
    </AdminShell>
  );
}
