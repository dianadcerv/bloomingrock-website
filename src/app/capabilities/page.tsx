import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Capabilities | BloomingRock Solutions",
  description:
    "Where BloomingRock helps small business owners reclaim time — customer follow-up, scheduling, admin, and workflows that actually get used.",
};

const outcomes = [
  {
    title: "Customer follow-up",
    body: "Missed replies, slow quotes, and leads that go quiet. We set up follow-up that happens without you chasing every thread.",
  },
  {
    title: "Scheduling & coordination",
    body: "Back-and-forth to book meetings, jobs, or appointments. We tighten the path from request to confirmed time.",
  },
  {
    title: "Admin & inbox load",
    body: "Repetitive sorting, drafting, filing, and status updates. We automate the boring loops so your week opens up.",
  },
  {
    title: "Simple reporting & summaries",
    body: "Notes, updates, and recaps that take too long to write. We build light workflows that turn activity into clear summaries.",
  },
  {
    title: "Team handoff that sticks",
    body: "A tool only helps if someone can run it. Every engagement ends with a walkthrough so the workflow lives with you — not with us.",
  },
];

export default function CapabilitiesPage() {
  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section className="page-hero" aria-label="Capabilities">
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

          <SiteHeader onDark current="capabilities" />

          <div className="page-hero__content">
            <p className="page-hero__brand">BloomingRock</p>
            <h1 className="page-hero__headline">
              Capabilities built around your real week.
            </h1>
            <p className="page-hero__support">
              We help owners reclaim time in the places work already piles up —
              then set up one workflow so it actually gets used.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" href={LOOK_PATH}>
                Book a free 15-minute look
              </Link>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="where-we-help">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">Where we help</p>
            <h2 className="section__title">Owner outcomes — not a tool catalog</h2>
            <p className="section__lead">
              If one of these sounds like your week, that’s usually where we
              start. We pick the highest-leverage quick win from discovery — not
              every shiny AI app on the market.
            </p>

            <ol className="offer-list">
              {outcomes.map((item, index) => (
                <li key={item.title}>
                  <span className="offer-list__num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="offer-list__title">{item.title}</h3>
                    <p className="offer-list__body">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section--moss" id="how-it-works">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">How an engagement works</p>
            <h2 className="section__title">Audit → Quick Win → Handoff</h2>
            <p className="section__lead">
              One focused package. Something working when we’re done.
            </p>

            <ol className="steps">
              <li>
                <span className="steps__label">01</span>
                <h3 className="steps__title">Discovery</h3>
                <p className="steps__body">
                  A short call to hear where your week gets repetitive or eaten
                  up.
                </p>
              </li>
              <li>
                <span className="steps__label">02</span>
                <h3 className="steps__title">Scope</h3>
                <p className="steps__body">
                  A clear scoping document with plan, timeline, and investment.
                </p>
              </li>
              <li>
                <span className="steps__label">03</span>
                <h3 className="steps__title">Build</h3>
                <p className="steps__body">
                  Audit the workflow, choose one quick win, and set it up
                  carefully.
                </p>
              </li>
              <li>
                <span className="steps__label">04</span>
                <h3 className="steps__title">Handoff</h3>
                <p className="steps__body">
                  Walk through it together so your team can run it without us.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="scope">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">Scope</p>
            <h2 className="section__title">What’s included — and what’s not</h2>
            <p className="section__lead">
              Clarity up front keeps the engagement useful and finishable.
            </p>

            <div className="scope-grid">
              <div className="scope-block">
                <h3 className="scope-block__title">Included</h3>
                <ul className="scope-list scope-list--in">
                  <li>Workflow audit with 1–3 written improvement opportunities</li>
                  <li>Hands-on setup of one selected AI workflow, tested and working</li>
                  <li>30-minute handoff so you and your team can run it</li>
                  <li>Tools chosen to fit how you already operate</li>
                </ul>
              </div>
              <div className="scope-block">
                <h3 className="scope-block__title">Not included (unless scoped later)</h3>
                <ul className="scope-list scope-list--out">
                  <li>Ongoing retainer or unlimited support</li>
                  <li>Additional workflows beyond the one quick win</li>
                  <li>Broad staff training beyond the handoff session</li>
                  <li>Custom software builds or full system replacements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="contact">
          <div className="section__inner cta-panel reveal">
            <p className="section__eyebrow">Next step</p>
            <h2 className="section__title">
              Not sure which outcome fits? Start with a free look.
            </h2>
            <p className="section__lead">
              Fifteen minutes. Tell me what a typical week looks like. I’ll tell
              you whether there’s a quick fix worth doing.
            </p>
            <Link className="btn btn--solid-light" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
