import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL, LOOK_PATH } from "@/lib/contact";
import { mintFormToken } from "@/lib/look-security";
import { LOOK_FOR_YOU, LOOK_NOT_FOR_YOU } from "./fit-copy";
import { LOOK_HEADLINE, LOOK_SUBHEAD } from "./headlines";
import { LOOK_FAQ } from "./look-faq";
import { LookBookScroll } from "./LookBookScroll";
import { LookForm } from "./LookForm";

const DEFAULT_BOOKING_URL =
  "https://calendar.app.google/m8GCvEo9nnwKyLrK9";

export const dynamic = "force-dynamic";

const headline = LOOK_HEADLINE;
const subhead = LOOK_SUBHEAD;

const PAGE_TITLE = "Book a complimentary 15-minute call | BloomingRock Solutions";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: subhead,
  alternates: { canonical: "/look" },
  openGraph: {
    title: PAGE_TITLE,
    description: subhead,
  },
  twitter: {
    title: PAGE_TITLE,
    description: subhead,
  },
};

export default async function LookPage() {
  const formToken = await mintFormToken();

  return (
    <div className="site">
      <SiteHeader current="look" />
      <main className="site-main">
        <LookBookScroll />
        <section
          className="moss r-section hero hero--compact"
          aria-label="Book a complimentary call"
        >
          <div className="wrap">
            <p className="label">Complimentary 15-minute call</p>
            <h1>{headline}</h1>
            <p className="sub">{subhead}</p>
            <Link className="btn" href={LOOK_PATH}>
              Book a complimentary call
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="how-it-works">
          <div className="wrap">
            <p className="label">How it works</p>
            <Accordion
              items={[
                {
                  num: "01",
                  title: "A complimentary 15-minute call",
                  body:
                    "We talk about what's slowing you down. There's nothing to prepare and nothing to buy. If it isn't a fit, I'll say so, and all you've spent is 15 minutes.",
                  defaultOpen: true,
                },
                {
                  num: "02",
                  title: "The Look",
                  body: (
                    <>
                      <p>
                        If it&apos;s a fit, the next step is a Look. It&apos;s a
                        paid working session on one problem in your shop.
                      </p>
                      <p>
                        Before we meet, you fill in a short intake form. That way
                        we don&apos;t spend the session on basics. We spend it on
                        where the work gets stuck and what to fix first.
                      </p>
                      <p>
                        You walk away with a ranked list of fixes for your shop.
                        If you go on to a Quick Win, what you paid for the Look
                        is credited toward it.
                      </p>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section className="moss r-section" id="look-fit">
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

        <section className="stone r-section" id="questions">
          <div className="wrap">
            <p className="label">Questions</p>
            <div className="prose">
              {LOOK_FAQ.map((item) => (
                <div key={item.question}>
                  <p>
                    <strong>{item.question}</strong>
                  </p>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="moss r-section look-book" id="book">
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
