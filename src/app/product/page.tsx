import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";
import { LOOK_FOR_YOU, LOOK_NOT_FOR_YOU } from "@/app/look/fit-copy";

const PAGE_TITLE = "Quote intake product | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "What we're building: one place for job files and notes, a customer upload link, a missing-details checklist, and review before anything goes out.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
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

const WHAT_IT_DOES = [
  "One place for the job's files and notes",
  "A customer upload link so missing drawings land on the job",
  "A checklist of what's still needed before anyone sits down to price",
  "You (or your estimator) review and sign off before anything goes out",
] as const;

const HOW_YOU_GET_IT = [
  {
    title: "Free 15-minute look",
    body: (
      <>
        A short call to see if quote intake is the right fix for your shop.{" "}
        <Link className="text-link" href={LOOK_PATH}>
          Book a look
        </Link>
        .
      </>
    ),
  },
  {
    title: "Paid Look ($750 diagnostic)",
    body: "A deeper read on how requests come in today and what's missing before pricing. Credited toward a Quick Win if you proceed.",
  },
  {
    title: "Quick Win",
    body: "One intake fix built in your tools and handed off so your team can run it.",
  },
  {
    title: "Keep It Running (optional)",
    body: "Light retainer after the Quick Win if you want help keeping the intake tidy as jobs change.",
  },
] as const;

export default function ProductPage() {
  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section className="page-hero" aria-label="Quote intake product">
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
              Quotes stall waiting on details. We&apos;re building a fix.
            </h1>
            <p className="page-hero__support">
              Pull emails, uploads, and notes into one job. Flag what&apos;s
              missing. You still make the final call.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" href={LOOK_PATH}>
                Book a look
              </Link>
              <Link className="btn btn--ghost" href="#how-it-works">
                How it works
              </Link>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section
          className="section section--stone"
          id="what-it-does"
          aria-labelledby="what-it-does-heading"
        >
          <div className="section__inner reveal">
            <p className="section__eyebrow">What we&apos;re building</p>
            <h2 className="section__title" id="what-it-does-heading">
              What it does
            </h2>
            <p className="section__lead">
              Plain tools for small fab, machine, and maker shops. What&apos;s
              below is product intent, not something live in your shop yet.
            </p>
            <ul className="scope-list scope-list--in" style={{ marginTop: "1.25rem" }}>
              {WHAT_IT_DOES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="section section--stone"
          id="fit"
          aria-labelledby="fit-heading"
        >
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">Fit</p>
            <h2 className="section__title" id="fit-heading">
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

        <hr className="divider" />

        <section
          className="section section--moss"
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
        >
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">How it works</p>
            <h2 className="section__title" id="how-it-works-heading">
              From scattered details to a job you can review
            </h2>
            <p className="section__lead">
              Three steps we&apos;re designing around. Not a live flow in your
              shop today.
            </p>

            <ol className="steps">
              <li>
                <span className="steps__label">01</span>
                <h3 className="steps__title">Job comes in</h3>
                <p className="steps__body">
                  Email, form, or upload. Whatever channel the customer used
                  lands on one job record instead of three inboxes.
                </p>
              </li>
              <li>
                <span className="steps__label">02</span>
                <h3 className="steps__title">Shop sends a link for what&apos;s missing</h3>
                <p className="steps__body">
                  The customer gets a simple upload link tied to that job, so
                  drawings and revisions don&apos;t get lost in reply-all.
                </p>
              </li>
              <li>
                <span className="steps__label">03</span>
                <h3 className="steps__title">Details land; you review with a full picture</h3>
                <p className="steps__body">
                  Files and notes sit on the job with a checklist of what&apos;s
                  still open. You or your estimator review and sign off before
                  anything goes out. Nothing goes out without a person in the
                  loop.
                </p>
              </li>
            </ol>

            <div className="about-copy" style={{ marginTop: "1.5rem" }}>
              <p>
                Already mark up drawings on a tablet (Goodnotes, for example)?
                Export a PDF and drop it in the same upload path. Optional, not
                required.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section section--moss"
          id="how-you-get-it"
          aria-labelledby="how-you-get-it-heading"
        >
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">How you get it</p>
            <h2 className="section__title" id="how-you-get-it-heading">
              Start with a look, build one intake fix
            </h2>
            <p className="section__lead">
              Same path as the rest of the site. No app signup, no production
              URL.
            </p>

            <ol className="offer-list">
              {HOW_YOU_GET_IT.map((step, index) => (
                <li key={step.title}>
                  <span className="offer-list__num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="offer-list__title">{step.title}</h3>
                    <p className="offer-list__body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <hr className="divider" />

        <section
          className="section section--stone"
          id="security"
          aria-labelledby="security-heading"
        >
          <div className="section__inner reveal">
            <p className="section__eyebrow">Security</p>
            <h2 className="section__title" id="security-heading">
              How we plan to handle your files
            </h2>
            <div className="about-copy">
              <p>
                We plan to keep each shop&apos;s files separate. Controlled
                jobs (ITAR/CUI) will be flagged and held before any AI
                processing. Detailed security notes for the product are coming.
                This is our commitment, not a description of what&apos;s
                deployed today.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section section--moss"
          id="whats-new"
          aria-labelledby="whats-new-heading"
        >
          <div className="section__inner reveal">
            <p className="section__eyebrow">What&apos;s new</p>
            <h2 className="section__title" id="whats-new-heading">
              Product updates
            </h2>
            <ul className="scope-list scope-list--in">
              <li>
                <strong>Oct 31, 2026</strong> — Page launched — product
                descriptions live here as we ship.
              </li>
            </ul>
          </div>
        </section>

        <section className="section section--stone" id="contact">
          <div className="section__inner cta-panel reveal">
            <p className="section__eyebrow">Next step</p>
            <h2 className="section__title">Start with a free 15-minute look</h2>
            <p className="section__lead">
              Tell me how quotes come in today. I&apos;ll say whether fixing
              intake is worth it, before anyone builds anything.
            </p>
            <Link className="btn btn--solid-light" href={LOOK_PATH}>
              Book a look
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
