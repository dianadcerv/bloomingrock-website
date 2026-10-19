import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/site";

const PAGE_TITLE = "RFQ Intake and Practical AI for Chicago Job Shops";
const PAGE_DESCRIPTION =
  "I help owner-run fab and machine shops in Chicagoland get quote requests, drawings, and call notes in one place, so you can price the job without chasing details.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/chicago-shops",
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// DIANA_CONFIRM: "I'm based in Chicago" — JSON-LD service area (80 km) and address below
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "BloomingRock Solutions",
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/chicago-shops`,
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 41.8781,
      longitude: -87.6298,
    },
    geoRadius: "80000",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chicago",
    addressRegion: "IL",
    addressCountry: "US",
  },
};

export default function ChicagoShopsPage() {
  return (
    <div className="site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <RevealObserver />
      <main className="site-main">
        <section
          className="page-hero"
          aria-label="Practical AI for Chicagoland job shops"
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
            <h1 className="page-hero__headline">
              Practical AI for Chicagoland job shops
            </h1>
          </div>
        </section>

        <section className="section section--stone" id="intro">
          <div className="section__inner reveal">
            <div className="about-copy">
              <p>
                I&apos;m Diana. I help owner-run custom shops in Chicagoland.
                Fab, welding, CNC, and other engineer-to-order work, with
                somewhere around{" "}
                {/* DIANA_CONFIRM: "3 to 25 people" public range — Vera flag 6 */}
                3 to 25 people. If you&apos;re the owner, you might also be the
                estimator. Requests come in by email, text, and phone, and the
                details get scattered before anyone sits down to quote.
              </p>
              <p>
                I&apos;m not selling big quoting software or a company-wide AI
                rollout. I help job shops set up RFQ intake: one place for the
                drawing, the revision, and the notes from the call, with missing
                pieces flagged before you price. A person still says yes before
                anything goes to the customer.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section section--moss"
          id="what-i-help-with"
          aria-labelledby="what-i-help-with-heading"
        >
          <div className="section__inner reveal">
            <h2 className="section__title" id="what-i-help-with-heading">
              What I help with
            </h2>
            <div className="about-copy">
              <p>
                I start with quoting, because that&apos;s where a lot of a
                normal week can disappear.{" "}
                {/* DIANA_CONFIRM: "I'm based in Chicago" + JSON-LD service area — Vera flag 3 */}
                I&apos;m based in Chicago and I&apos;m focused on shops here
                and in the suburbs.
              </p>
            </div>
            <ul className="scope-list scope-list--in" style={{ marginTop: "1.25rem" }}>
              <li>
                Engineer-to-order quoting, when every job is custom and the
                request is spread across three inboxes.
              </li>
              <li>
                Quoting custom fabrication jobs faster by getting the details
                together first. Not by auto-pricing parts you&apos;ve never run.
              </li>
              <li>
                Practical AI for family-owned businesses. Once the checklist
                habit is in place, AI can pull dates and specs out of emails so
                someone checks them instead of retyping them.
              </li>
            </ul>
            <div className="about-copy" style={{ marginTop: "1.25rem" }}>
              <p>
                I wrote more about the missing-details problem in{" "}
                <Link className="text-link" href="/quotes-stall">
                  why quotes stall
                </Link>
                . If you want a printable list for the floor, grab the{" "}
                <Link className="text-link" href="/pre-quote-checklist">
                  pre-quote checklist
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="section section--stone" id="how-it-works">
          <div className="section__inner reveal">
            <h2 className="section__title">How we start</h2>
            <div className="about-copy">
              <p>
                If you&apos;re looking for an AI consultant for manufacturers in
                Chicago, I keep the first step small. It&apos;s a free
                15-minute look at how requests come into your shop today,
                by email, website, walk-in, or whatever you use. If there&apos;s
                a quick win, I&apos;ll tell you. If there isn&apos;t, I&apos;ll
                tell you that too.
              </p>
              <p>
                I do the setup myself, then hand it off so your team knows where
                intake lives and what to do when a line on the checklist is
                blank. No ripping out your ERP. The goal is something small
                enough that your people will actually use it.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="cta">
          <div className="section__inner cta-panel reveal">
            <p className="section__eyebrow">Chicagoland shops</p>
            <h2 className="section__title">
              Want a second set of eyes on your quote intake?
            </h2>
            <p className="section__lead">
              Book a free look. I&apos;ll tell you if there&apos;s something worth
              fixing before you commit to anything.
            </p>
            <Link className="btn btn--primary" href="/look">
              Book a 15-minute look
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
