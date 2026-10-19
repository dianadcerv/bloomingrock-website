import type { Metadata } from "next";
import Image from "next/image";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL } from "@/lib/contact";
import { createFormToken } from "@/lib/look-security";
import { LOOK_FOR_YOU, LOOK_NOT_FOR_YOU } from "./fit-copy";
import { activeLookHeadline } from "./headlines";
import { LookForm } from "./LookForm";

const DEFAULT_BOOKING_URL =
  "https://calendar.app.google/m8GCvEo9nnwKyLrK9";

export const dynamic = "force-dynamic";

const { headline, subhead } = activeLookHeadline();

export const metadata: Metadata = {
  title: "Book a 15-minute look | BloomingRock Solutions",
  description: subhead,
  alternates: {
    canonical: "/look",
  },
  openGraph: {
    title: "Book a 15-minute look | BloomingRock Solutions",
    description: subhead,
  },
  twitter: {
    title: "Book a 15-minute look | BloomingRock Solutions",
    description: subhead,
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
            <h1 className="page-hero__headline">{headline}</h1>
            <p className="page-hero__support">{subhead}</p>
          </div>
        </section>

        <section
          className="section section--stone"
          id="look-fit"
          aria-labelledby="look-fit-heading"
        >
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">Fit</p>
            <h2 className="section__title" id="look-fit-heading">
              Is this a fit?
            </h2>

            <div className="scope-grid">
              <div className="scope-block">
                <h3 className="scope-block__title">This is for you if</h3>
                <ul className="scope-list scope-list--in">
                  {LOOK_FOR_YOU.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="scope-block">
                <h3 className="scope-block__title">This isn&apos;t for you if</h3>
                <ul className="scope-list scope-list--out">
                  {LOOK_NOT_FOR_YOU.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="look-form">
          <div className="section__inner look-panel reveal">
            <LookForm
              formToken={createFormToken()}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              bookingUrl={
                process.env.BOOKING_URL?.trim() || DEFAULT_BOOKING_URL
              }
            />
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
