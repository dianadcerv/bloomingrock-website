import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { BrandWatermark } from "@/components/BrandWatermark";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

const PAGE_TITLE = "Start here | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "Practical AI for small shops, explained plainly. Plain answers on what it is, what it does, and why BloomingRock.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/start-here" },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

const LEARN_ITEMS: { title: string; body: ReactNode }[] = [
  {
    title: "What is it, in plain words?",
    body: "It's AI that takes busywork off your desk, so quotes and follow-ups don't stall.",
  },
  {
    title: "How does it work?",
    body: "The tools read your requests, drawings, and emails, sort them, and draft the next step. A person on your team reviews it before anything moves.",
  },
  {
    title: "What does it actually do?",
    body: "It helps with intake, quote prep, follow-ups, and notes. That's where quotes stall, intake gets messy, and follow-ups slip.",
  },
  {
    title: "What isn't it?",
    body: "It's not a replacement for your people, and it's not a big, expensive overhaul. You don't need to understand AI, and your customer files don't get handed to random free tools.",
  },
  {
    title: "Who does it help?",
    body: "Owner-estimators and the front-office person who's buried in requests. If you run a small fab, machine, maker, trades, or family shop, this is for you.",
  },
  {
    title: "How do I start?",
    body: (
      <>
        <p>
          Pick one problem, fix it, and hand it off so your team owns it. Book a
          Look, or grab the pre-quote checklist to start on your own.
        </p>
        <Link className="btn btn--in-body" href={LOOK_PATH}>
          Book a Look
        </Link>
        <p className="more">
          <Link className="text-link" href="/pre-quote-checklist">
            Get the pre-quote checklist
          </Link>
        </p>
      </>
    ),
  },
];

const WHY_ITEMS = [
  {
    title: "Built for small shops.",
    body: "I work with small shops here in Chicago, not big enterprises.",
  },
  {
    title: "One quick win.",
    body: "You get one fix that works, not a platform you have to learn.",
  },
  {
    title: "Your team owns it.",
    body: "I hand it off and train your team so they actually use it. If you want help keeping it running after that, that's an option too.",
  },
  {
    title: "Your drawings stay safe.",
    body: "Customer drawings and data get handled with care, never dropped into random free tools.",
  },
] as const;

export default function StartHerePage() {
  return (
    <div className="site">
      <SiteHeader />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="Start here">
          <div className="wrap">
            <p className="label">Start here</p>
            <h1>You&apos;re in the right place.</h1>
            <p className="sub">
              Practical AI for small shops, explained plainly.
            </p>
            <div className="door-cards">
              <Link className="door-card" href="#learn">
                Is this even for my shop?
              </Link>
              <Link className="door-card" href="#why">
                Why BloomingRock?
              </Link>
            </div>
          </div>
        </section>

        <section
          className="stone r-section"
          id="learn"
          aria-labelledby="learn-label"
        >
          <div className="wrap">
            <p className="label" id="learn-label">
              Learn
            </p>
            <Accordion
              items={LEARN_ITEMS.map((item, index) => ({
                num: String(index + 1).padStart(2, "0"),
                title: item.title,
                body: item.body,
                defaultOpen: index === 0,
              }))}
            />
          </div>
        </section>

        <section
          className="moss r-section"
          id="why"
          aria-labelledby="why-label"
        >
          <div className="wrap">
            <p className="label" id="why-label">
              Why BloomingRock
            </p>
            <div className="cols cols--why">
              {WHY_ITEMS.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
            <p className="more read-more">
              Read more:{" "}
              <Link className="text-link" href="/make-ai-stick">
                How AI sticks
              </Link>
              {" · "}
              <Link className="text-link" href="/quotes-stall">
                Why quotes stall
              </Link>
              {" · "}
              <Link className="text-link" href="/about">
                About
              </Link>
              {" · "}
              <Link className="text-link" href="/product">
                What we&apos;re building
              </Link>
            </p>
          </div>
        </section>

        <section className="moss r-section cta">
          <BrandWatermark />
          <div className="wrap">
            <p className="label">Next step</p>
            <h2>Start with one problem.</h2>
            <p className="sub">
              Book a Look, or grab the pre-quote checklist and start on your own.
            </p>
            <Link className="btn" href={LOOK_PATH}>
              Book a Look
            </Link>
            <p className="more">
              <Link className="text-link" href="/pre-quote-checklist">
                Get the pre-quote checklist
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
