import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { mintFormToken } from "@/lib/look-security";
import { PaidLookIntakeForm } from "./PaidLookIntakeForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paid Look client intake | BloomingRock Solutions",
  description: "Private client intake for the Paid Look diagnostic. Not indexed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PaidLookIntakePage() {
  const formToken = await mintFormToken();

  return (
    <div className="site">
      <SiteHeader />
      <main className="site-main">
        <section
          className="moss r-section hero hero--compact"
          aria-label="Paid Look client intake"
        >
          <div className="wrap">
            <p className="label">Paid Look</p>
            <h1>Paid Look intake</h1>
            <p className="sub">Private form for clients who booked a Paid Look.</p>
          </div>
        </section>

        <section className="moss r-section" id="paid-look-intake-form">
          <div className="wrap look-panel">
            <PaidLookIntakeForm
              formToken={formToken}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
