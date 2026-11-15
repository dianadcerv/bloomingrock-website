import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";

const PAGE_TITLE = "RFQ Intake and Practical AI for Chicago Job Shops";
const PAGE_DESCRIPTION =
  "I help owner-run fab and machine shops in Chicagoland get quote requests, drawings, and call notes in one place, so you can price the job without chasing details.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/chicago-shops" },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
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
      <SiteHeader />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="Chicagoland job shops">
          <div className="wrap">
            <p className="label">Chicagoland</p>
            <h1>Practical AI for Chicagoland job shops.</h1>
            <p className="sub">
              I&apos;m Diana. I help owner-run custom shops in Chicagoland. Fab,
              welding, CNC, and other engineer-to-order work, with somewhere
              around 3 to 25 people.
            </p>
            <Link className="btn" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="what-i-help-with">
          <div className="wrap">
            <p className="label">What I help with</p>
            <h2>
              I start with quoting, because that&apos;s where a lot of a normal
              week can disappear.
            </h2>
            <div className="prose">
              <p>
                I&apos;m not selling big quoting software or a company-wide AI
                rollout. I help job shops set up RFQ intake: one place for the
                drawing, the revision, and the notes from the call, with missing
                pieces flagged before you price. A person still says yes before
                anything goes to the customer.
              </p>
              <ul>
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
              <p>
                More on the missing-details problem in{" "}
                <Link className="text-link" href="/quotes-stall">
                  why quotes stall
                </Link>
                , or grab the{" "}
                <Link className="text-link" href="/pre-quote-checklist">
                  pre-quote checklist
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="moss r-section" id="how-we-start">
          <div className="wrap">
            <p className="label">How we start</p>
            <h2>Start small, and get an honest answer.</h2>
            <div className="prose">
              <p>
                It&apos;s a free 15-minute look at how requests come into your
                shop today, by email, website, walk-in, or whatever you use. If
                there&apos;s a quick win, I&apos;ll tell you. If there isn&apos;t,
                I&apos;ll tell you that too.
              </p>
              <p>
                I do the setup myself, then hand it off so your team knows where
                intake lives and what to do when a line on the checklist is blank.
                No ripping out your ERP.
              </p>
            </div>
          </div>
        </section>

        <CtaSection
          title="Want a second set of eyes on your quote intake?"
          buttonLabel="Book a 15-minute look"
        >
          <p className="sub">
            Book a free look. I&apos;ll tell you if there&apos;s something worth
            fixing before you commit to anything.
          </p>
        </CtaSection>
      </main>
      <SiteFooter />
    </div>
  );
}
