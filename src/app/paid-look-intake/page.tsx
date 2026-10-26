import type { Metadata } from "next";
import Image from "next/image";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { mintFormToken } from "@/lib/look-security";
import { PaidLookIntakeForm } from "./PaidLookIntakeForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paid Look client intake | BloomingRock Solutions",
  description:
    "Private client intake for the Paid Look ($750 diagnostic). Not indexed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PaidLookIntakePage() {
  const formToken = await mintFormToken();

  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section
          className="page-hero page-hero--look"
          aria-label="Paid Look client intake"
        >
          <div className="page-hero__media" aria-hidden="true">
            <Image
              src="/hero-stone-bloom.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={85}
            />
          </div>
          <div className="page-hero__veil" aria-hidden="true" />

          <SiteHeader onDark />

          <div className="page-hero__content">
            <p className="page-hero__brand">BloomingRock</p>
            <h1 className="page-hero__headline">Paid Look intake</h1>
          </div>
        </section>

        <section className="section section--moss" id="paid-look-intake-form">
          <div className="section__inner look-panel look-panel--wide reveal">
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
