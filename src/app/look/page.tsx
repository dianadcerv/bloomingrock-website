import type { Metadata } from "next";
import Image from "next/image";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL } from "@/lib/contact";
import { LookForm } from "./LookForm";

export const metadata: Metadata = {
  title: "Book a 15-minute look | BloomingRock Solutions",
  description:
    "Request a free 15-minute look at where AI can save real time in your week — then get one workflow set up so it actually gets used.",
  alternates: {
    canonical: "/look",
  },
};

export default function LookPage() {
  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section className="page-hero page-hero--look" aria-label="Book a look">
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

          <SiteHeader onDark current="look" />

          <div className="page-hero__content">
            <p className="page-hero__brand">BloomingRock</p>
            <h1 className="page-hero__headline">
              A closer look at your week — no charge.
            </h1>
            <p className="page-hero__support">
              Fifteen minutes. I’ll tell you whether there’s a quick win worth
              doing. Fill this in so I can look at the business first.
            </p>
          </div>
        </section>

        <section className="section section--stone" id="look-form">
          <div className="section__inner look-panel reveal">
            <LookForm />
            <p className="look-fallback">
              Prefer email?{" "}
              <a className="cta-email" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
