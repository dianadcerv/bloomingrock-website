import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { CtaSection } from "@/components/CtaSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Capabilities | BloomingRock Solutions",
  description:
    "Where BloomingRock helps small business owners reclaim time: customer follow-up, scheduling, admin, and workflows that actually get used.",
  alternates: { canonical: "/capabilities" },
};

const outcomes = [
  {
    title: "Customer follow-up",
    body: "Missed replies, slow quotes, and leads that go quiet. We set up follow-up that happens without you chasing every thread.",
  },
  {
    title: "Scheduling and coordination",
    body: "Back-and-forth to book meetings, jobs, or appointments. We tighten the path from request to confirmed time.",
  },
  {
    title: "Admin and inbox load",
    body: "Repetitive sorting, drafting, filing, and status updates. We automate the boring loops so your week opens up.",
  },
  {
    title: "Simple reporting and summaries",
    body: "Notes, updates, and recaps that take too long to write. We build light workflows that turn activity into clear summaries.",
  },
  {
    title: "Team handoff that sticks",
    body: "A tool only helps if someone can run it. Every engagement ends with a walkthrough so the workflow lives with you, not with us.",
  },
] as const;

export default function CapabilitiesPage() {
  return (
    <div className="site">
      <SiteHeader current="capabilities" />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="Capabilities">
          <div className="wrap">
            <p className="label">Capabilities</p>
            <h1>Capabilities built around your real week.</h1>
            <p className="sub">
              We help owners reclaim time in the places work already piles up,
              then set up one workflow so it actually gets used.
            </p>
            <Link className="btn" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="where-we-help">
          <div className="wrap">
            <p className="label">Where we help</p>
            <h2>Owner outcomes, not a tool catalog.</h2>
            <p className="sub">
              If one of these sounds like your week, that&apos;s usually where we
              start. We pick the highest-leverage quick win from discovery, not
              every shiny AI app on the market.
            </p>
            <div className="cols">
              {outcomes.map((item) => (
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
            <p className="label">How an engagement works</p>
            <h2>Audit, Quick Win, Handoff. One focused package.</h2>
            <Accordion
              items={[
                {
                  num: "01",
                  title: "Discovery",
                  body:
                    "A short call to hear where your week gets repetitive or eaten up.",
                  defaultOpen: true,
                },
                {
                  num: "02",
                  title: "Scope",
                  body:
                    "A clear scoping document with plan, timeline, and investment.",
                },
                {
                  num: "03",
                  title: "Build",
                  body:
                    "Audit the workflow, choose one quick win, and set it up carefully.",
                },
                {
                  num: "04",
                  title: "Handoff",
                  body:
                    "Walk through it together so your team can run it without us.",
                },
              ]}
            />
          </div>
        </section>

        <section className="stone r-section" id="scope">
          <div className="wrap">
            <p className="label">Scope</p>
            <h2>Clarity up front keeps the engagement useful and finishable.</h2>
            <div className="two">
              <div>
                <h3>Included</h3>
                <ul>
                  <li>Workflow audit with 1–3 written improvement opportunities</li>
                  <li>Hands-on setup of one selected AI workflow, tested and working</li>
                  <li>30-minute handoff so you and your team can run it</li>
                  <li>Tools chosen to fit how you already operate</li>
                </ul>
              </div>
              <div>
                <h3>Not included (unless scoped later)</h3>
                <ul>
                  <li>Ongoing retainer or unlimited support</li>
                  <li>Additional workflows beyond the one quick win</li>
                  <li>Broad staff training beyond the handoff session</li>
                  <li>Custom software builds or full system replacements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CtaSection
          title="Not sure which outcome fits? Start with a free look."
          buttonLabel="Book a free 15-minute look"
        >
          <p className="sub">
            Fifteen minutes. Tell me what a typical week looks like. I&apos;ll tell
            you whether there&apos;s a quick fix worth doing.
          </p>
        </CtaSection>
      </main>
      <SiteFooter />
    </div>
  );
}
