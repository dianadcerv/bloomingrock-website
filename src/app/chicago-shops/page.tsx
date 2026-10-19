import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/site";

/** DRAFT pending Vera — Chicago local page copy */

const PAGE_TITLE =
  "Practical AI and RFQ intake for Chicagoland job shops | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "I help owner-run fab and machine shops in Chicagoland gather quote requests in one place — drawings, revisions, and call notes — so a person can price the job without chasing details.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
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
                I&apos;m Diana. I work with owner-run custom shops in Chicagoland
                — fab, welding, CNC, and other engineer-to-order work — usually
                about 3 to 25 people. The owner is often the estimator. Requests
                come in by email, text, and phone, and the details scatter before
                anyone sits down to quote.
              </p>
              <p>
                I&apos;m not selling big quoting software or a company-wide AI
                rollout.                 I help you set up RFQ intake for job shops: one place for the
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
                Most of my work starts with quoting — because that&apos;s where
                a normal week gets eaten up. These are the problems I hear from
                shops around Chicago, Elk Grove, Schaumburg, Joliet, and the
                industrial corridors west and south of the city.
              </p>
            </div>
            <ul className="scope-list scope-list--in" style={{ marginTop: "1.25rem" }}>
              <li>
                Engineer-to-order quoting when every job is custom and the
                request lives in three inboxes.
              </li>
              <li>
                A simple way to quote custom fabrication jobs faster by
                gathering details first — not by auto-pricing parts you&apos;ve
                never run.
              </li>
              <li>
                Secure customer file upload for quotes so drawings don&apos;t sit
                in personal email attachments.
              </li>
              <li>
                Practical AI for family-owned business: pull dates and specs out
                of email so someone checks them instead of retyping — after the
                checklist habit is in place.
              </li>
            </ul>
            <div className="about-copy" style={{ marginTop: "1.25rem" }}>
              <p>
                I wrote more about the missing-details problem on{" "}
                <Link className="text-link" href="/quotes-stall">
                  why quotes stall
                </Link>
                . If you want a printable list to use on the floor, grab the{" "}
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
                Chicago, I keep the first step small. A free 15-minute look at how requests
                actually come into your shop — email, website, walk-ins, whatever
                you use today. If there&apos;s a quick win, I&apos;ll say so. If
                not, I&apos;ll say that too.
              </p>
              <p>
                I lead the setup myself and hand it off so your team knows where
                the intake lives and what happens when a line on the checklist is
                blank. No rip-and-replace ERP project. Usually it&apos;s a form, a
                shared folder, and a short habit your people already have time for.
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
