import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { CtaSection } from "@/components/CtaSection";
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
  alternates: { canonical: "/product" },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

const WHAT_IT_DOES = [
  { title: "One place", body: "For the job's files and notes." },
  {
    title: "Upload link",
    body: "A customer upload link so missing drawings land on the job.",
  },
  {
    title: "Checklist",
    body: "What's still needed before anyone sits down to price.",
  },
  {
    title: "Your sign-off",
    body: "You (or your estimator) review and sign off before anything goes out.",
  },
] as const;

const PRODUCT_UPDATES = [
  {
    date: "Nov 13, 2026",
    body:
      "Security check on our site and client portal after a November FBI alert about AI-driven attacks on small business portals and suppliers. We're tightening request limits, keeping error messages from showing technical details, and checking for exposed keys.",
  },
  {
    date: "Nov 13, 2026",
    body:
      "Twice-monthly code audits keep our code simple and easier to keep secure.",
  },
  {
    date: "Nov 7, 2026",
    body:
      "Intake now offers a quick summary or a full report, so we come to your first conversation already knowing your shop.",
  },
  {
    date: "Nov 1, 2026",
    body:
      "Files uploaded through our site are private and only reachable after login. Our website forms check for bots before they accept a submission.",
  },
  {
    date: "Oct 31, 2026",
    body: "Page launched. Product descriptions live here as we ship.",
  },
] as const;

export default function ProductPage() {
  return (
    <div className="site">
      <SiteHeader current="product" />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="Quote intake product">
          <div className="wrap">
            <p className="label">What we&apos;re building</p>
            <h1>Quotes stall waiting on details. We&apos;re building a fix.</h1>
            <p className="sub">
              Pull emails, uploads, and notes into one job. Flag what&apos;s
              missing. You still make the final call.
            </p>
            <Link className="btn" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="what-it-does">
          <div className="wrap">
            <p className="label">What it does</p>
            <h2>Plain tools for small fab, machine, and maker shops.</h2>
            <p className="sub">
              What&apos;s below is product intent, not something live in your shop
              yet.
            </p>
            <div className="cols">
              {WHAT_IT_DOES.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="moss r-section" id="how-it-works">
          <div className="wrap">
            <p className="label">How it works</p>
            <h2>From scattered details to a job you can review.</h2>
            <p className="sub">
              Three steps we&apos;re designing around. Not a live flow in your shop
              today.
            </p>
            <Accordion
              items={[
                {
                  num: "01",
                  title: "Job comes in",
                  body:
                    "Email, form, or upload. Whatever channel the customer used lands on one job record instead of three inboxes.",
                  defaultOpen: true,
                },
                {
                  num: "02",
                  title: "Shop sends a link for what's missing",
                  body:
                    "The customer gets a simple upload link tied to that job, so drawings and revisions don't get lost in reply-all.",
                },
                {
                  num: "03",
                  title: "Details land; you review with a full picture",
                  body: (
                    <>
                      Files and notes sit on the job with a checklist of what&apos;s
                      still open. You or your estimator review and sign off before
                      anything goes out. Nothing goes out without a person in the
                      loop. Already mark up drawings on a tablet (Goodnotes, for
                      example)? Export a PDF and drop it in the same upload path.
                      Optional, not required.
                    </>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section className="stone r-section" id="fit">
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

        <section className="moss r-section" id="how-you-get-it">
          <div className="wrap">
            <p className="label">How you get it</p>
            <h2>Start with a look, build one intake fix.</h2>
            <p className="sub">
              Same path as the rest of the site. No app signup, no production URL.
            </p>
            <Accordion
              items={[
                {
                  num: "01",
                  title: "Free 15-minute look",
                  meta: "Free",
                  body: (
                    <>
                      A short call to see if quote intake is the right fix for your
                      shop.{" "}
                      <Link className="text-link" href={LOOK_PATH}>
                        Book a look
                      </Link>
                      .
                    </>
                  ),
                },
                {
                  num: "02",
                  title: "Paid Look",
                  meta: "Diagnostic",
                  body:
                    "A deeper read on how requests come in today and what's missing before pricing.",
                },
                {
                  num: "03",
                  title: "Quick Win",
                  body:
                    "One intake fix built in your tools and handed off so your team can run it.",
                },
                {
                  num: "04",
                  title: "Keep It Running",
                  meta: "Optional",
                  body:
                    "Light ongoing care after the Quick Win if you want help keeping the intake tidy as jobs change.",
                },
              ]}
            />
          </div>
        </section>

        <section className="stone r-section" id="security">
          <div className="wrap">
            <p className="label">Security</p>
            <h2>How we plan to handle your files.</h2>
            <p className="sub">
              We plan to keep each shop&apos;s files separate. Controlled jobs
              (ITAR/CUI) will be flagged and held before any AI processing.
              Detailed security notes for the product are coming. This is our
              commitment, not a description of what&apos;s deployed today.
            </p>
          </div>
        </section>

        <section className="stone r-section rule" id="whats-new">
          <div className="wrap">
            <p className="label">What&apos;s new</p>
            <h2>Product updates.</h2>
            <ul className="updates">
              {PRODUCT_UPDATES.map((item, index) => (
                <li key={index}>
                  <span>{item.date}</span>
                  {item.body}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaSection
          title="Start with a free 15-minute look."
          buttonLabel="Book a look"
        >
          <p className="sub">
            Tell me how quotes come in today. I&apos;ll say whether fixing intake is
            worth it, before anyone builds anything.
          </p>
        </CtaSection>
      </main>
      <SiteFooter />
    </div>
  );
}
