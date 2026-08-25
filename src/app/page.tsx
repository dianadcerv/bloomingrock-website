import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

export default function Home() {
  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section className="hero" aria-label="Introduction">
          <div className="hero__media" aria-hidden="true">
            <Image
              src="/hero-stone-bloom.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={85}
            />
          </div>
          <div className="hero__veil" aria-hidden="true" />
          <div className="hero__fog" aria-hidden="true" />

          <SiteHeader onDark current="home" />

          <div className="hero__content">
            <p
              className="hero__brand brand-mark brand-mark--on-dark"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
            >
              <svg
                viewBox="0 0 32 32"
                aria-hidden="true"
                style={{ width: "1.1em", height: "1.1em" }}
              >
                <path
                  className="mark-stone"
                  d="M4 26c0-1 2-6 6-9 1.5-1.1 3.2-1.8 5-2.1.4 2.2 1.2 4.1 2.4 5.6-3.2 1.4-7.4 3.8-10.2 7.3-.6.8-1.8.3-1.8-.6V26z"
                />
                <path
                  className="mark-stone"
                  d="M14 26c2.2-3.4 5.8-5.4 9.8-6.2 1.4-.3 2.8-.3 4.2 0 .3.9-.3 1.6-1.2 1.8-3.2.6-6 2-8.2 4.4-.5.6-1.5.4-1.8-.3L14 26z"
                />
                <path
                  className="mark-bloom"
                  d="M16.2 6.2c.4-1.8 2.8-2.4 3.8-.8.7 1.1.2 2.5-.9 3.1 1.4.2 2.5 1.4 2.4 2.9-.1 1.6-1.5 2.8-3.1 2.7-1.4-.1-2.5-1.1-2.8-2.4-1.3.6-2.9.1-3.5-1.2-.7-1.5.3-3.2 1.9-3.5.5-.1 1 0 1.4.2.1-1 .6-1.8 1.8-2z"
                />
                <path
                  className="mark-bloom"
                  d="M16.5 14.8c0 2.4-.2 5.2-.6 7.8-.1.6-.9.7-1.1.1-.5-2.4-.7-5-.7-7.4 0-.5.5-.8.9-.7.6.1 1.1.4 1.5.2z"
                  opacity="0.85"
                />
              </svg>
              BloomingRock
            </p>
            <h1 className="hero__headline">
              Growth that lasts — rooted in how you already work.
            </h1>
            <p className="hero__support">
              Find one or two places where AI can save real time, then get it
              set up so it actually gets used.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" href={LOOK_PATH}>
                Book a free 15-minute look
              </Link>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="problem">
          <div className="section__inner reveal">
            <p className="section__eyebrow">The problem</p>
            <h2 className="section__title">
              You know AI could help. You don’t have time to make it stick.
            </h2>
            <p className="section__lead">
              Most owners don’t fail at AI because tools are bad — they fail
              because nothing gets wired into the real week. Generic setups
              don’t match how your business already runs, so they gather dust.
            </p>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="offering">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">The offering</p>
            <h2 className="section__title">Audit + Quick Win + Handoff</h2>
            <p className="section__lead">
              One focused engagement. Clear deliverables. Something working when
              we’re done — not a slide deck of possibilities.
            </p>

            <ol className="offer-list">
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  01
                </span>
                <div>
                  <h3 className="offer-list__title">Workflow audit</h3>
                  <p className="offer-list__body">
                    A clear look at the process in scope, plus a written summary
                    of one to three places AI can save real time.
                  </p>
                </div>
              </li>
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  02
                </span>
                <div>
                  <h3 className="offer-list__title">Quick win implementation</h3>
                  <p className="offer-list__body">
                    Hands-on setup of one selected workflow — tested and
                    confirmed working around how you already operate.
                  </p>
                </div>
              </li>
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  03
                </span>
                <div>
                  <h3 className="offer-list__title">Handoff session</h3>
                  <p className="offer-list__body">
                    A 30-minute walkthrough so you and your team can run it
                    without calling anyone for every click.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="section section--moss" id="how-it-works">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">How it works</p>
            <h2 className="section__title">
              From first conversation to working workflow
            </h2>
            <p className="section__lead">
              Low pressure. Clear next steps. Built for owners who need results
              without another project that never finishes.
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
                  A simple scoping document with the plan, timeline, and
                  investment.
                </p>
              </li>
              <li>
                <span className="steps__label">03</span>
                <h3 className="steps__title">Build</h3>
                <p className="steps__body">
                  Audit the workflow, pick the best quick win, and set it up
                  carefully.
                </p>
              </li>
              <li>
                <span className="steps__label">04</span>
                <h3 className="steps__title">Handoff</h3>
                <p className="steps__body">
                  Walk through it together so it sticks — then it’s yours to
                  run.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="contact">
          <div className="section__inner cta-panel reveal">
            <p className="section__eyebrow">Next step</p>
            <h2 className="section__title">
              Let’s take a closer look — no charge for the first look.
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
