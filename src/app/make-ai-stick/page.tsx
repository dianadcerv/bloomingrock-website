import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { CtaSection } from "@/components/CtaSection";
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
  alternates: { canonical: "/make-ai-stick" },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

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
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Audit + Quick Win + Handoff",
  alternateName: "Make AI Stick for Small Business",
  description:
    "A focused project for busy small business owners: a workflow audit, hands-on setup of one AI quick win inside the tools they already use, and a 30-minute handoff so the team can run it on their own.",
  provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  areaServed: { "@type": "Audience", audienceType: "Small business owners" },
  serviceType: "AI workflow audit and setup",
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
      <SiteHeader current="make-ai-stick" />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="How I work">
          <div className="wrap">
            <p className="label">How I work</p>
            <h1>AI that actually gets used, for busy owners.</h1>
            <p className="sub">
              I help you put AI to work on one real task your team already does,
              not another login nobody opens. I look at how the work gets done,
              set up one quick win in the tools you already use, and show your
              team how to run it.
            </p>
            <Link className="btn" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="answer-ready">
          <div className="wrap">
            <p className="label">The honest answer</p>
            <h2>How do I get AI set up so my team actually uses it?</h2>
            <div className="prose">
              <p>
                AI sticks in a small business when it&apos;s built into one
                workflow your team already runs. Handing everyone a chatbot login
                or sending them to another workshop doesn&apos;t do it.
              </p>
              <p>
                First, I look at how work moves through that one process and name
                one to three places it could save time. Next, I set up one quick
                win inside the tools you already use and test it during a normal
                week. Then I walk your team through it so they can run it without
                calling someone for every click.
              </p>
              <p>
                The first step is a free 15-minute look to see if a quick fix is
                even worth doing.
              </p>
            </div>
          </div>
        </section>

        <section className="moss r-section" id="shop-example">
          <div className="wrap">
            <p className="label">What this looks like in a shop</p>
            <h2>Say a custom job request lands at a 20-person fab shop.</h2>
            <div className="prose">
              <p>
                The details are spread across an email thread, a PDF spec, two
                drawing revisions, and a note from a phone call. Before anyone can
                price it, someone has to read all of it and pull out what matters:
                material, quantities, tolerances, finish, and what the customer
                changed since last time. In a lot of small shops that someone is
                the owner, and that&apos;s why quotes sit for days.
              </p>
              <p>
                I set up one tool that gathers those details into a single summary
                your estimator checks and prices from. A person still reviews every
                quote. Your team just stops spending hours digging for the
                information.
              </p>
            </div>
          </div>
        </section>

        <section className="stone r-section" id="why-dust">
          <div className="wrap">
            <p className="label">Why setups gather dust</p>
            <h2>AI setups that shine in the demo often fade in a normal week.</h2>
            <div className="prose">
              <p>
                If you&apos;ve tried an AI subscription, a workshop, or a list of
                tips and watched it fade, you&apos;re not alone. The tool usually
                isn&apos;t the problem. The problem is that it never got connected
                to the work your team already does Monday through Friday.
              </p>
              <p>
                Your week{"\u2019"}s already full. AI helps most when it fits into
                work people were already going to do, ideally in tools they already
                use.
              </p>
              <p>
                <Link
                  className="text-link"
                  href="/make-ai-stick/why-setups-gather-dust"
                >
                  What the research says about making AI stick
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="moss r-section" id="engagement">
          <div className="wrap">
            <p className="label">The work</p>
            <h2>Audit, Quick Win, Handoff. Here&apos;s exactly what you get.</h2>
            <Accordion
              items={[
                {
                  num: "01",
                  title: "Workflow audit",
                  body:
                    "I take a close look at the process we picked and write up one to three places AI can save real time there. No forty-slide roadmap and no scorecard of promised savings.",
                  defaultOpen: true,
                },
                {
                  num: "02",
                  title: "Quick win setup",
                  body:
                    "I set up the one process we picked, test it, and make sure it fits how you already work. One fix goes live in your real week, and everything else waits.",
                },
                {
                  num: "03",
                  title: "30-minute handoff",
                  body:
                    "I walk through it with you and the people who'll run it: what it does, who owns it day to day, where it lives, and when to ask for help.",
                },
              ]}
            />
          </div>
        </section>

        <section className="stone r-section" id="fit">
          <div className="wrap">
            <p className="label">Fit</p>
            <h2>Who this is for, and who it&apos;s not.</h2>
            <div className="two">
              <div>
                <h3>Good fit</h3>
                <ul>
                  <li>Repetitive work is eating your week</li>
                  <li>You&apos;re okay starting with one process, not ten</li>
                  <li>Your team will use what we build after the handoff</li>
                  <li>You already think AI could help and just need it set up</li>
                </ul>
              </div>
              <div>
                <h3>Not a fit</h3>
                <ul>
                  <li>&ldquo;Do AI across the whole company this quarter&rdquo;</li>
                  <li>Big enterprise retainers</li>
                  <li>Shop-floor robotics or heavy machine-control projects</li>
                  <li>People who only want a course or certificate</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="moss r-section" id="faq">
          <div className="wrap">
            <p className="label">FAQ</p>
            <h2>Short answers.</h2>
            <Accordion
              items={faqItems.map((item, index) => ({
                num: String(index + 1).padStart(2, "0"),
                title: item.question,
                body: item.answer,
              }))}
            />
          </div>
        </section>

        <CtaSection
          title="15-minute first look, no charge."
          buttonLabel="Book a free 15-minute look"
        >
          <p className="sub">
            Give me fifteen minutes and tell me what a typical week looks like.
            I&apos;ll tell you honestly whether a quick fix is worth doing. No
            guarantees and no hard sell.
          </p>
        </CtaSection>
      </main>
      <SiteFooter />
    </div>
  );
}
