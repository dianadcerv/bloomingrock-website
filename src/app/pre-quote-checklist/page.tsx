import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { mintFormToken } from "@/lib/look-security";
import { ChecklistForm } from "./ChecklistForm";
import { ChecklistInteractive } from "./ChecklistInteractive";
import "./checklist.css";

const PAGE_TITLE = "Pre-quote checklist for custom jobs | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "A one-page checklist for small fab and machine shops. Drawings, material, quantity, tolerances, finish, due date, and contact, all gathered before you price the job.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/pre-quote-checklist" },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export default async function PreQuoteChecklistPage() {
  const formToken = await mintFormToken();

  return (
    <div className="site">
      <SiteHeader tone="on-moss" />
      <main className="site-main">
        <section
          className="moss r-section hero hero--compact"
          aria-label="Pre-quote checklist"
        >
          <div className="wrap">
            <p className="label">Printable checklist</p>
            <h1>Gather the details before you quote.</h1>
            <p className="sub">
              A quote can sit for days waiting on a missing drawing, revision, or
              call note. The math is rarely the slow part. This checklist builds
              on{" "}
              <Link className="text-link" href="/quotes-stall">
                why quotes stall
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="stone r-section" id="checklist-preview">
          <div className="wrap">
            <p className="label">On the page</p>
            <h2>What&apos;s on the list</h2>
            <p className="sub" style={{ maxWidth: "36rem", marginBottom: "1.25rem" }}>
              Tick boxes as you gather details. Nothing you check here is saved or
              sent anywhere — it&apos;s just for you on this screen and when you
              print.
            </p>
            <div className="checklist-preview-panel">
              <ChecklistInteractive />
            </div>
          </div>
        </section>

        <section className="stone r-section" id="checklist-form">
          <div className="wrap look-panel">
            <ChecklistForm
              formToken={formToken}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </section>

        <CtaSection
          title="Start with a free 15-minute look."
          buttonLabel="Book a free 15-minute look"
        >
          <p className="sub">
            Fifteen minutes. Tell me what a typical week looks like. I&apos;ll tell
            you whether there&apos;s a quick fix worth doing.
          </p>
        </CtaSection>
      </main>
      <SiteFooter />
    </div>
  );
}