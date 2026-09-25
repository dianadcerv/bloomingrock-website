import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Make AI Stick for Small Business: Audit, Quick Win & Handoff | BloomingRock Solutions",
  description:
    "Generic AI setups gather dust. BloomingRock packages a workflow audit, one quick-win wired into how you already work, and a 30-minute handoff so your team can run it, not a slide deck.",
  alternates: {
    canonical: "/make-ai-stick",
  },
};

const ANSWER_READY =
  "AI sticks in a small business when it is wired into one real workflow your team already runs, not when everyone gets a chatbot login or sits through another workshop. A practical path is: audit how work moves in that process and name one to three time-savers; implement a single quick win inside the tools you already use and test it against a normal week; then do a short handoff so the team can run it without calling someone for every click. BloomingRock Solutions offers that as one focused engagement (Audit + Quick Win + Handoff), built for busy owners who need something working when you're done, not a slide deck of possibilities. Start with a free 15-minute first look to see whether a quick fix is even worth doing.";

const SHOP_EXAMPLE =
  "Say you run a 20-person fab shop and a request for a custom job comes in. The details are spread across an email thread, a PDF spec, two drawing revisions, and a note from a phone call. Before anyone can price it, someone has to read all of it and pull out what matters: material, quantities, tolerances, finish, and what the customer changed since last time. In a lot of small shops that someone is the owner, and that's why quotes sit for days. We set up one tool that gathers those details into a single summary your estimator checks and prices from. A person still reviews every quote. Your team just stops spending hours digging for the information.";

const faqItems = [
  {
    question: "Can AI help a small shop quote custom jobs faster?",
    answer:
      "Yes. We set up one tool that gathers the details scattered across emails, PDF specs, and drawings into a single summary your estimator checks and prices from, and a person still reviews every quote.",
  },
  {
    question: "Can we start with ChatGPT we already have?",
    answer:
      "Often, yes. The point is not which logo is on the login screen. It is whether AI is wired into a workflow your team already runs, inside tools they already open. If what you have can do the job, we start there.",
  },
  {
    question: "Do we need new software?",
    answer:
      "Not by default. Quick win implementation happens inside how you already operate: the inbox, calendar, CRM, spreadsheets, or chat tool your week already lives in. New apps only come up if nothing you have can support the workflow in scope.",
  },
  {
    question: "Will my non-technical team be able to run it?",
    answer:
      "That is the bar. We pick one workflow, set it up carefully, test it against a normal week, then walk through it in a 30-minute handoff so your owner and team know who runs it, where it lives, and when to ask for help.",
  },
  {
    question: "Is this training?",
    answer:
      "No. This is a focused engagement: audit, one working quick win, and handoff so the team can run it. You are not buying a course, a workshop series, or a slide deck of possibilities.",
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
    "A focused engagement for busy small business owners: workflow audit, hands-on implementation of one AI quick win inside existing tools, and a 30-minute handoff so the team can run it without ongoing dependency.",
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
              Wire AI into one real workflow, not another login nobody opens.
              Audit, one quick win inside tools you already use, and a short
              handoff so your team owns it.
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
              Generic AI setups fail in the real week, not in the demo
            </h2>
            <div className="about-copy">
              <p>
                If you have tried a subscription, a workshop, or a tip list and
                watched it fade, you are not alone. The tools are rarely the
                problem. What fails is the wiring: nothing connects to the
                process your team already runs Monday through Friday.
              </p>
              <p>
                You get another tab, another copy-paste loop, or a chatbot login
                that only one person remembers. Workshop theater feels productive
                for an afternoon, then everyone goes back to the old path because
                nobody owns maintenance. There is no clear place the workflow
                lives, and no simple rule for when to use it.
              </p>
              <p>
                Small manufacturers, trades, and family-run shops feel this
                quickly. Your week is already full. AI only helps when it sits
                inside work people were going to do anyway, in software they
                already open.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="what-stick-means">
          <div className="section__inner reveal">
            <p className="section__eyebrow">What we mean</p>
            <h2 className="section__title">What &ldquo;make AI stick&rdquo; means here</h2>
            <p className="section__lead">
              A workflow audit, one wired quick win inside your existing tools,
              and a short handoff so your team can run it. One focused engagement,
              not a slide deck and not generic training.
            </p>
            <div className="about-copy">
              <h3 className="offer-list__title" style={{ marginTop: "0.5rem" }}>
                Not licenses, workshops, or tip lists
              </h3>
              <p>
                More seats on an AI product does not fix a process nobody mapped.
                A tip list gives ideas without setup, testing, or ownership. A
                workshop can energize the room and still leave Monday unchanged.
                Here, one workflow ships, tested against a normal week, with a
                clear handoff.
              </p>
              <p>
                Training asks everyone to learn a new habit in the abstract.
                This engagement picks one process, wires AI into it, and leaves
                your team with something they can run on Tuesday. That is the
                difference between AI that actually gets used and AI that lives
                in a folder.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="engagement">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">The engagement</p>
            <h2 className="section__title">Audit + Quick Win + Handoff</h2>
            <p className="section__lead">
              What you get is concrete. What you do not get is a transformation
              roadmap or open-ended support disguised as strategy.
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
                    of one to three places AI can save real time in that workflow.
                    Not a forty-slide transformation roadmap or an ROI-scorecard
                    pitch. Just enough clarity to pick one win worth building.
                  </p>
                  {/* TODO(Diana): Add sample anonymized audit summary (structure + redacted example) when ready. */}
                </div>
              </li>
              <li>
                <span className="offer-list__num" aria-hidden="true">
                  02
                </span>
                <div>
                  <h3 className="offer-list__title">Quick win implementation</h3>
                  <p className="offer-list__body">
                    Hands-on setup of one selected workflow, tested and confirmed
                    around how you already operate. One win ships inside your real
                    week; everything else waits. This is not a tip-list quick win
                    you still have to figure out alone after the call.
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
                    A walkthrough with you and the people who will run it: what
                    the workflow does, who owns it day to day, where it lives, and
                    when to escalate. After that, your team runs it without calling
                    for every click.
                  </p>
                  {/* TODO(Diana): Spell out what is covered in the 30-minute handoff beyond these basics (checklist, recording, written recap, etc.). */}
                </div>
              </li>
            </ol>

            <div className="scope-grid">
              <div className="scope-block">
                <h3 className="scope-block__title">What you get</h3>
                <ul className="scope-list scope-list--in">
                  <li>Workflow audit with written summary (1–3 opportunities)</li>
                  <li>One selected quick win built and tested in your tools</li>
                  <li>30-minute handoff for owner and team</li>
                  <li>Plain-language notes on ownership and escalation</li>
                </ul>
              </div>
              <div className="scope-block">
                <h3 className="scope-block__title">What you don&apos;t get</h3>
                <ul className="scope-list scope-list--out">
                  <li>Company-wide AI rollout or unlimited workflows</li>
                  <li>Training-as-the-product workshops or slide decks</li>
                  <li>Ongoing retainer or on-call for every new idea</li>
                  <li>Shop-floor robotics or enterprise transformation work</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="path">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">The path</p>
            <h2 className="section__title">
              From first conversation to working workflow
            </h2>
            <p className="section__lead">
              Low pressure, clear next steps. You always know what happens next.
            </p>

            <ol className="steps">
              <li>
                <span className="steps__label">01</span>
                <h3 className="steps__title">Discovery</h3>
                <p className="steps__body">
                  A short call about where your week gets repetitive or eaten up.
                  You describe a typical week; I listen for one process worth
                  scoping.
                </p>
              </li>
              <li>
                <span className="steps__label">02</span>
                <h3 className="steps__title">Scope</h3>
                <p className="steps__body">
                  A simple scoping document with the plan, timeline, and
                  investment for the audit, quick win, and handoff.
                </p>
                {/* TODO(Diana): Confirm pricing/investment ranges and typical timeline length for scoping doc (not shown on this page until approved). */}
              </li>
              <li>
                <span className="steps__label">03</span>
                <h3 className="steps__title">Build</h3>
                <p className="steps__body">
                  Run the workflow audit, pick the best quick win, and set it up
                  carefully inside how you already work. Test it against a normal
                  week before we call it done.
                </p>
              </li>
              <li>
                <span className="steps__label">04</span>
                <h3 className="steps__title">Handoff</h3>
                <p className="steps__body">
                  Walk through it together. Then it is yours to run: your team
                  knows the steps, the owner, and when to reach out.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="who-for">
          <div className="section__inner section__inner--wide reveal">
            <p className="section__eyebrow">Fit</p>
            <h2 className="section__title">Who this is for (and who it is not)</h2>
            <p className="section__lead">
              Built for busy owners of small manufacturers, trades, and
              family-run shops who want one thing working in the real week.
            </p>

            <div className="scope-grid">
              <div className="scope-block">
                <h3 className="scope-block__title">Good fit</h3>
                <ul className="scope-list scope-list--in">
                  <li>Repetitive work that eats the week</li>
                  <li>Willing to start with one workflow, not ten</li>
                  <li>A team that will touch the result after handoff</li>
                  <li>You already believe AI could help; you need it wired in</li>
                </ul>
              </div>
              <div className="scope-block">
                <h3 className="scope-block__title">Not a fit</h3>
                <ul className="scope-list scope-list--out">
                  <li>&ldquo;Do AI company-wide this quarter&rdquo;</li>
                  <li>Enterprise transformation retainers</li>
                  <li>Shop-floor robotics or heavy OT projects</li>
                  <li>People who only want a course or certificate</li>
                </ul>
              </div>
            </div>

            {/* TODO(Diana): Add founder photo/bio blurb and preferred wording for one-woman practice + subcontractors model. */}
            {/* TODO(Diana): Add testimonials or anonymized case studies when available. */}

            <div className="about-copy" style={{ marginTop: "2rem" }}>
              <p>
                BloomingRock meets you where you are: one focused engagement,
                something working when we are done. I lead the work and bring in
                trusted help when a job needs extra hands.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--stone" id="different">
          <div className="section__inner reveal">
            <p className="section__eyebrow">How this compares</p>
            <h2 className="section__title">
              Different from DIY and from big-firm AI
            </h2>
            <div className="about-copy">
              <p>
                DIY can work when someone inside the business owns integration,
                training, and tuning over time. Many busy owners simply do not have
                that bandwidth, and that is an honest constraint, not a character
                flaw. Without ownership, even good tools drift.
              </p>
              <p>
                Big-firm AI programs are the wrong size for most small shops.
                You do not need a quarter-long transformation narrative to fix
                follow-up, scheduling, or admin that repeats every week. You need
                one workflow wired correctly, with a handoff your team can run.
              </p>
              <p>
                BloomingRock is sized for that: audit, one quick win, handoff.
                Focused setup so AI actually gets used, not training sold as the
                product.
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
              Fifteen minutes. Tell me what a typical week looks like. I will
              give you an honest read on whether a quick fix is worth doing. No
              guarantees, no hard sell.
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
