import type { Metadata } from "next";
import { AdminShell } from "@/components/portal/AdminShell";
import { DraftNotice, OpenQuestion, PageIntro } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import { NORTHRIDGE_BRANDING } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Branding" };

export default async function ShopAdminBrandingPage() {
  const session = await requireShopAdmin();
  const b = NORTHRIDGE_BRANDING;

  return (
    <AdminShell session={session} current="/admin/branding">
      <PageIntro eyebrow="Shop admin" title="Branding">
        <p>
          Pick logo and colors, or enter a website URL to inherit branding (demo shows a mock
          extraction, labeled). Customer-facing PDFs and sign-off include a small{" "}
          <strong>Powered by BloomingRock</strong> line.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.brandingWebsiteExtract}</OpenQuestion>
      <DraftNotice>FAKE DATA — not saved in demo.</DraftNotice>
      <form className="portal-form">
        <label className="look-field">
          <span className="look-field__label">Logo</span>
          <input className="look-field__input" readOnly value={b.logoLabel} />
        </label>
        <div className="portal-brand-swatches">
          <label className="look-field">
            <span className="look-field__label">Primary</span>
            <input className="look-field__input" readOnly value={b.primaryColor} />
            <span
              className="portal-brand-swatch"
              style={{ background: b.primaryColor }}
              aria-hidden
            />
          </label>
          <label className="look-field">
            <span className="look-field__label">Accent</span>
            <input className="look-field__input" readOnly value={b.accentColor} />
            <span
              className="portal-brand-swatch"
              style={{ background: b.accentColor }}
              aria-hidden
            />
          </label>
        </div>
        <label className="look-field">
          <span className="look-field__label">Or inherit from website URL</span>
          <input
            className="look-field__input"
            placeholder="https://example.com"
            defaultValue="https://northridge-steel.demo"
          />
        </label>
        <p className="look-field__hint portal-provenance portal-provenance--interpretation">
          Demo mock extraction — not a live scrape. Would preview colors + logo guess here.
        </p>
      </form>
      <section className="portal-section">
        <h2>Preview on shop outputs</h2>
        <p className="look-field__hint">
          Sign-off, work order, and requirements PDF show your logo plus: Powered by BloomingRock
        </p>
      </section>
    </AdminShell>
  );
}
