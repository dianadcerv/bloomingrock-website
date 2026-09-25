import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_TITLE = "Make AI Stick in Your Small Business | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "Most AI setups end up unused. I look at how you work, set up one fix in tools you already use, and hand it off so your team can run it.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/make-ai-stick",
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

const ANSWER_READY =
  "AI sticks in a small business when it's built into one workflow your team already runs. Handing everyone a chatbot login or sending them to another workshop doesn't do it. Here's the path I use. First, I look at how work moves through that one process and name one to three places it could save time. Next, I set up one quick win inside the tools you already use and test it during a normal week. Then I walk your team through it so they can run it without calling someone for every click. BloomingRock Solutions does all three as one focused package: Audit, Quick Win, and Handoff. It's built for busy owners who want something working at the end, not a slide deck of ideas. The first step is a free 15-minute look to see if a quick fix is even worth doing.";

const SHOP_EXAMPLE =
  "Say you run a 20-person fab shop and a request for a custom job comes in. The details are spread across an email thread, a PDF spec, two drawing revisions, and a note from a phone call. Before anyone can price it, someone has to read all of it and pull out what matters: material, quantities, tolerances, finish, and what the customer changed since last time. In a lot of small shops that someone is the owner, and that's why quotes sit for days. I set up one tool that gathers those details into a single summary your estimator checks and prices from. A person still reviews every quote. Your team just stops spending hours digging for the information.";

const faqItems = [
  {
    question: "Can AI help a small shop quote custom jobs faster?",
    answer:
      "Yes. I set up one tool that gathers the details scattered across emails, PDF specs, and drawings into a single summary your estimator checks and prices from, and a person still reviews every quote.",
  },
  {
    question: "Can we start with the ChatGPT we already have?",
    answer:
      "Often, yes. What matters isn't which logo is on the login screen. It's whether AI fits into work your team already does, in tools they already open. If what you have can do the job, we start there.",
  },
  {
    question: "Do we need new software?",
    answer:
      "Usually not. I set up the quick win inside the tools your week already runs on: your inbox, calendar, CRM, spreadsheets, or chat. New apps only come up if nothing you have can handle the job.",
  },
  {
    question: "Will my non-technical team be able to run it?",
    answer:
      "That's the whole point. I pick one process, set it up carefully, and test it during a normal week. Then we walk through it in a 30-minute handoff so you and your team know who runs it, where it lives, and when to ask for help.",
  },
  {
    question: "Is this training?",
    answer:
      "No. You get an audit, one quick win that works, and a handoff so your team can run it. You're not buying a course, a workshop series, or a slide deck of ideas.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Audit + Quick Win + Handoff",
  alternateName: "Make AI Stick for Small Business",
  description:
    "A focused project for busy small business owners: a workflow audit, hands-on setup of one AI quick win inside the tools they already use, and a 30-minute handoff so the team can run it on their own.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Audience",
    audienceType: "Small business owners",
  },
  serviceType: "AI workflow audit and implementation",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/look`,
    description:
      "Free 15-minute first look to discuss whether a quick fix is worth doing.",
  },
};

export default function MakeAiStickPage() {
  return (
    <div className="site">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <RevealObserver />
      <main className="site-main">
        <section className="page-hero" aria-label="Make AI stick">
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
              AI that actually gets used, for busy owners
            </h1>
            <p className="page-hero__support">
              I help you put AI to work on one real task your team already does,
              not another login nobody opens. I look at how the work gets done, set
              up one quick win in the tools you already use, and show your team
              how to run it.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" href={LOOK_PATH}>
                Book a free 15-minute look
              </Link>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section
          className="section section--stone"
          id="answer-ready"
          aria-labelledby="answer-ready-heading"
        >
          <div className="section__inner reveal">
            <p className="section__eyebrow">The honest answer</p>
            <h2 className="section__title" id="answer-ready-heading">
              How do I get AI set up so my team actually uses it?
            </h2>
            <div className="about-copy">
              <p>{ANSWER_READY}</p>
            </div>
          </div>
        </section>

        <section
          className="section section--moss"
          id="shop-example"
          aria-labelledby="shop-example-heading"
        >
          <div className="section__inner reveal">
            <h2 className="section__title" id="shop-example-heading">
              What this looks like in a shop
            </h2>
            <div className="about-copy">
              <p>{SHOP_EXAMPLE}</p>
            </div>
            {/* TODO(Diana): Confirm shop size and example details against what you're hearing in customer interviews. */}
            <p className="section__lead" style={{ marginTop: "1.5rem" }}>
              <Link className="text-link" href={LOOK_PATH}>
                Book a free 15-minute first look
              </Link>{" "}
              if you want an honest read on whether that path fits your week.
            </p>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="why-dust">
          <div className="section__inner reveal">
            <p className="section__eyebrow">Why setups gather dust</p>
            <h2 className="section__title">
              AI setups that shine in the demo often fade in a normal week
            </h2>
            <div className="about-copy">
              <p>
                If you&apos;ve tried an AI subscription, a workshop, or a list
                of tips and watched it fade, you&apos;re not alone. The tool
                usually isn&apos;t the problem. The problem is that it never got
                connected to the work your team already does Monday through
                Friday.
              </p>
              <p>
                You end up with another tab, more copy and paste, or a chatbot
                login only one person remembers. A workshop feels productive for
                an afternoon. Then everyone goes back to the old way, because
                nobody owns keeping it going. There&apos;s no set place where it
                lives and no simple rule for when to use it.
              </p>
              <p>
                Small manufacturers, trades, and family-run shops feel this
                fast. Your week&apos;s already full. AI only helps when it fits
                into work people were already going to do, in software they
                already open.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="what-stick-means">
          <div className="section__inner reveal">
            <p className="section__eyebrow">What I mean</p>
            <h2 className="section__title">What &ldquo;make AI stick&rdquo; means here</h2>
            <p className="section__lead">
              I look at how one process works, set up one quick win inside the
              tools you already have, and show your team how to run it. It&apos;s
              one focused project, not a slide deck and not generic training.
            </p>
            <div className="about-copy">
              <h3 className="offer-list__title" style={{ marginTop: "0.5rem" }}>
                Not licenses, workshops, or tip lists
              </h3>
              <p>
                Buying more seats on an AI tool won&apos;t fix a process nobody
                has looked at closely. A tip list gives you ideas but no setup,
                no testing, and no owner. A workshop can get the room excited and
                still leave Monday exactly the same. Here, one process gets set
                up, tested in a normal week, and handed off clearly.
              </p>
              <p>
                Training asks everyone to pick up a new habit without a real task
                to use it on. I pick one process, set AI up inside it, and leave
                your team with something they can use on Tuesday. That&apos;s the
                difference between AI that gets used and AI that sits in a
                folder.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="engagement">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">The work</p>
            <h2 className="section__title">Audit + Quick Win + Handoff</h2>
            <p className="section__lead">
              Here&apos;s exactly what you get. You won&apos;t get a big AI
              roadmap or open-ended support dressed up as strategy.
            </p>

            <ol className="offer-list">
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  01
                </span>
                <div>
                  <h3 className="offer-list__title">Workflow audit</h3>
                  <p className="offer-list__body">
                    I take a close look at the process we picked and write up one
                    to three places AI can save real time there. No forty-slide
                    roadmap and no scorecard of promised savings. Just enough to
                    pick one fix worth building.
                  </p>
                  {/* TODO(Diana): Add sample anonymized audit summary (structure + redacted example) when ready. */}
                </div>
              </li>
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  02
                </span>
                <div>
                  <h3 className="offer-list__title">Quick win setup</h3>
                  <p className="offer-list__body">
                    I set up the one process we picked, test it, and make sure it
                    fits how you already work. One fix goes live in your real
                    week, and everything else waits. You won&apos;t be left with a
                    tip to figure out on your own after the call.
                  </p>
                  {/* TODO(Diana): Name tools/stack examples you are comfortable listing on the page (e.g. Google Workspace, Microsoft 365, specific CRMs). */}
                </div>
              </li>
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  03
                </span>
                <div>
                  <h3 className="offer-list__title">30-minute handoff</h3>
                  <p className="offer-list__body">
                    I walk through it with you and the people who&apos;ll run it:
                    what it does, who owns it day to day, where it lives, and
                    when to ask for help. After that, your team runs it without
                    calling someone for every click.
                  </p>
                  {/* TODO(Diana): Spell out what is covered in the 30-minute handoff beyond these basics (checklist, recording, written recap, etc.). */}
                </div>
              </li>
            </ol>

            <div className="scope-grid">
              <div className="scope-block">
                <h3 className="scope-block__title">What you get</h3>
                <ul className="scope-list scope-list--in">
                  <li>Workflow audit with a written summary (1–3 ideas)</li>
                  <li>One quick win built and tested in your tools</li>
                  <li>30-minute handoff for you and your team</li>
                  <li>Plain notes on who owns it and when to ask for help</li>
                </ul>
              </div>
              <div className="scope-block">
                <h3 className="scope-block__title">What you don&apos;t get</h3>
                <ul className="scope-list scope-list--out">
                  <li>A company-wide AI rollout or unlimited projects</li>
                  <li>Workshops or slide decks sold as the product</li>
                  <li>An ongoing retainer or on-call help for every new idea</li>
                  <li>Shop-floor robotics or big enterprise projects</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="path">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">The path</p>
            <h2 className="section__title">From first call to something that works</h2>
            <p className="section__lead">
              No pressure, and you&apos;ll always know what happens next.
            </p>

            <ol className="steps">
              <li>
                <span className="steps__label">01</span>
                <h3 className="steps__title">Talk</h3>
                <p className="steps__body">
                  A short call about where your week gets repetitive or eaten up.
                  You tell me what a typical week looks like, and I listen for
                  one process worth tackling.
                </p>
              </li>
              <li>
                <span className="steps__label">02</span>
                <h3 className="steps__title">Plan</h3>
                <p className="steps__body">
                  I send a simple plan with the timeline and cost for the audit,
                  quick win, and handoff.
                </p>
                {/* TODO(Diana): Confirm pricing/investment ranges and typical timeline length for scoping doc (not shown on this page until approved). */}
              </li>
              <li>
                <span className="steps__label">03</span>
                <h3 className="steps__title">Build</h3>
                <p className="steps__body">
                  I look closely at the process, pick the best quick win, and set
                  it up carefully inside how you already work. We test it during a
                  normal week before calling it done.
                </p>
              </li>
              <li>
                <span className="steps__label">04</span>
                <h3 className="steps__title">Handoff</h3>
                <p className="steps__body">
                  We walk through it together. Then it&apos;s yours: your team
                  knows the steps, who owns it, and when to reach out.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="who-for">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">Fit</p>
            <h2 className="section__title">Who this is for (and who it&apos;s not)</h2>
            <p className="section__lead">
              For busy owners of small manufacturers, trades, and family-run shops
              who want one thing working in a normal week.
            </p>

            <div className="scope-grid">
              <div className="scope-block">
                <h3 className="scope-block__title">Good fit</h3>
                <ul className="scope-list scope-list--in">
                  <li>Repetitive work is eating your week</li>
                  <li>You&apos;re okay starting with one process, not ten</li>
                  <li>Your team will use what we build after the handoff</li>
                  <li>
                    You already think AI could help and just need it set up
                  </li>
                </ul>
              </div>
              <div className="scope-block">
                <h3 className="scope-block__title">Not a fit</h3>
                <ul className="scope-list scope-list--out">
                  <li>&ldquo;Do AI across the whole company this quarter&rdquo;</li>
                  <li>Big enterprise retainers</li>
                  <li>Shop-floor robotics or heavy machine-control projects</li>
                  <li>People who only want a course or certificate</li>
                </ul>
              </div>
            </div>

            {/* TODO(Diana): Add founder photo/bio blurb when ready. */}
            {/* TODO(Diana): Add testimonials or anonymized case studies when available. */}

            <div className="about-copy" style={{ marginTop: "2rem" }}>
              <p>
                I meet you where you are. It&apos;s one focused project, and
                you&apos;ll have something working when we&apos;re done. I lead
                the work myself and bring in people I trust when a job needs
                extra hands.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--stone" id="different">
          <div className="section__inner reveal">
            <p className="section__eyebrow">How this compares</p>
            <h2 className="section__title">
              Different from doing it yourself and from big-firm AI
            </h2>
            <div className="about-copy">
              <p>
                Doing it yourself can work if someone in the business owns
                setting it up, teaching the team, and adjusting it over time. A
                lot of busy owners just don&apos;t have that time, and
                that&apos;s okay. Without an owner, even good tools drift.
              </p>
              <p>
                Big-firm AI programs are the wrong size for most small shops. You
                don&apos;t need a months-long overhaul to fix follow-ups,
                scheduling, or admin that repeats every week. You need one
                process set up right, with a handoff your team can run.
              </p>
              <p>
                BloomingRock is built for that size of job: an audit, one quick
                win, and a handoff. I set it up so AI actually gets used.
                I&apos;m not selling training.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--moss" id="faq">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">FAQ</p>
            <h2 className="section__title">Short answers</h2>
            <div className="faq-list">
              {faqItems.map((item) => (
                <article key={item.question} className="faq-item">
                  <h3 className="faq-item__question">{item.question}</h3>
                  <p className="faq-item__answer">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="contact">
          <div className="section__inner cta-panel reveal">
            <p className="section__eyebrow">Next step</p>
            <h2 className="section__title">
              15-minute first look, no charge
            </h2>
            <p className="section__lead">
              Give me fifteen minutes and tell me what a typical week looks like.
              I&apos;ll tell you honestly whether a quick fix is worth doing. No
              guarantees and no hard sell.
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
