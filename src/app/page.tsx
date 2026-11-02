import Image from "next/image";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { CtaSection } from "@/components/CtaSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

const WHO_CARDS = [
  {
    title: "Custom fab and machine shops",
    body: "Quote requests, drawings, and follow-ups that pile up before pricing.",
  },
  {
    title: "Makers",
    body: "Custom work where the details matter before the quote.",
  },
  {
    title: "Trades",
    body: "Back-and-forth to book jobs and appointments.",
  },
  {
    title: "Family-run shops",
    body: "Admin and inbox load that eats the week.",
  },
] as const;

export default function Home() {
  return (
    <div className="site">
      <SiteHeader />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="Introduction">
          <div className="wrap">
            <p className="label">BloomingRock Solutions</p>
            <h1>
              Practical AI for small shops, set up so your team actually uses it.
            </h1>
            <p className="sub">
              Find one or two places where AI can save real time, then get it set
              up so it actually gets used.
            </p>
            <Link className="btn" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="problem">
          <div className="wrap">
            <p className="label">The problem</p>
            <h2>You know AI could help. You don&apos;t have time to make it stick.</h2>
            <p className="sub">
              Most owners don&apos;t fail at AI because tools are bad. They fail
              because nothing gets wired into the real week. Generic setups
              don&apos;t match how your business already runs, so they gather dust.
            </p>
          </div>
        </section>

        <section className="moss r-section" id="how-it-works">
          <div className="wrap">
            <p className="label">How it works</p>
            <h2>
              One focused project. Something working when we&apos;re done, not a
              slide deck of ideas.
            </h2>
            <Accordion
              items={[
                {
                  num: "01",
                  title: "Paid Look",
                  body:
                    "A deeper read on how requests come in today and what's missing before pricing, with a written summary of one to three places AI can save real time.",
                  defaultOpen: true,
                },
                {
                  num: "02",
                  title: "Quick Win",
                  body:
                    "Hands-on setup of one selected workflow, tested and confirmed working around how you already operate. Ends with a 30-minute handoff so you and your team can run it without calling anyone for every click.",
                },
                {
                  num: "03",
                  title: "Keep It Running",
                  meta: "Optional",
                  body:
                    "Light ongoing care after the Quick Win if you want help keeping things tidy as jobs change.",
                },
              ]}
            />
          </div>
        </section>

        <section className="stone r-section" id="who">
          <div className="wrap">
            <p className="label">Who it&apos;s for</p>
            <h2>
              For busy owners of small manufacturers, trades, and family-run shops
              who want one thing working in a normal week.
            </h2>
            <div className="cols">
              {WHO_CARDS.map((card) => (
                <div key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
            <p className="more">
              <Link className="text-link" href="/make-ai-stick">
                See how I make AI stick
              </Link>
            </p>
          </div>
        </section>

        <CtaSection title="Start with a free 15-minute look." buttonLabel="Book a look">
          <div className="me">
            <Image
              src="/diana.jpg"
              alt="Diana Cervantes, founder of BloomingRock Solutions"
              width={72}
              height={72}
            />
            <p className="sub">
              Tell me how quotes come in today. I&apos;ll say whether fixing intake
              is worth it, before anyone builds anything.
            </p>
          </div>
        </CtaSection>
      </main>
      <SiteFooter />
    </div>
  );
}
