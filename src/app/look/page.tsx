import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL } from "@/lib/contact";
import { mintFormToken } from "@/lib/look-security";
import { LOOK_FOR_YOU, LOOK_NOT_FOR_YOU } from "./fit-copy";
import { LOOK_HEADLINE, LOOK_SUBHEAD } from "./headlines";
import { LookForm } from "./LookForm";

const DEFAULT_BOOKING_URL =
  "https://calendar.app.google/m8GCvEo9nnwKyLrK9";

export const dynamic = "force-dynamic";

const headline = LOOK_HEADLINE;
const subhead = LOOK_SUBHEAD;

export const metadata: Metadata = {
  title: "Book a 15-minute look | BloomingRock Solutions",
  description: subhead,
  alternates: { canonical: "/look" },
  openGraph: {
    title: "Book a 15-minute look | BloomingRock Solutions",
    description: subhead,
  },
  twitter: {
    title: "Book a 15-minute look | BloomingRock Solutions",
    description: subhead,
  },
};

export default async function LookPage() {
  const formToken = await mintFormToken();

  return (
    <div className="site">
      <SiteHeader current="look" />
      <main className="site-main">
        <section
          className="moss r-section hero hero--compact"
          aria-label="Book a look"
        >
          <div className="wrap">
            <p className="label">Free 15-minute look</p>
            <h1>{headline}</h1>
            <p className="sub">{subhead}</p>
          </div>
        </section>

        <section className="stone r-section" id="look-fit">
          <div className="wrap">
            <p className="label">Fit</p>
            <h2>Is this a fit?</h2>
            <div className="two">
              <div>
                <h3>This is for you if</h3>
                <ul>
                  {LOOK_FOR_YOU.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>This isn&apos;t for you if</h3>
                <ul>
                  {LOOK_NOT_FOR_YOU.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="moss r-section" id="look-form">
          <div className="wrap look-panel">
            <LookForm
              formToken={formToken}
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
