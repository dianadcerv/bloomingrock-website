import type { Metadata } from "next";
import { AdminShell } from "@/components/portal/AdminShell";
import { ExtractedProvenanceMarker } from "@/components/portal/ProvenanceMarkers";
import { OpenQuestion, PageIntro, StatusPill } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import { INTEGRATIONS_DEMO } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Integrations" };

export default async function ShopAdminIntegrationsPage() {
  const session = await requireShopAdmin();

  return (
    <AdminShell session={session} current="/admin/integrations">
      <PageIntro eyebrow="Shop admin" title="Integrations">
        <p>
          Email and transcript upload are shown as connected in the demo. Accounting, ERP, and file
          storage are listed as being explored — not functional.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.emailAutoAttachLearning}</OpenQuestion>
      <section className="portal-section">
        <h2>Connected / available</h2>
        <ul className="portal-list">
          {INTEGRATIONS_DEMO.connected.map((item) => (
            <li key={item.id} className="portal-list__item">
              <div>
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
                {item.id === "gmail" || item.id === "m365" ? (
                  <ExtractedProvenanceMarker label="Gathered from email (demo label on job sources)" />
                ) : null}
              </div>
              <StatusPill tone={item.status === "connected" ? "ok" : "draft"}>
                {item.status === "connected" ? "Connected" : "Available"}
              </StatusPill>
            </li>
          ))}
        </ul>
      </section>
      <section className="portal-section">
        <h2>Being explored</h2>
        <ul className="portal-plain">
          {INTEGRATIONS_DEMO.exploring.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> ({item.category}) — not connected in demo
            </li>
          ))}
        </ul>
      </section>
      <p className="look-field__hint">
        Linked project participants (engineer, sales, materials, vendors) have project emails pulled
        into the project; the app suggests the match until learning rules exist (open question above).
      </p>
    </AdminShell>
  );
}
