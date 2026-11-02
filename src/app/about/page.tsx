import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About | BloomingRock Solutions",
  description:
    "BloomingRock helps small business owners find one or two places where AI can save real time, then set it up around how they already work so it actually gets used.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="site">
      <SiteHeader current="about" />
      <main className="site-main">
        <section className="moss r-section hero" aria-label="About">
          <div className="wrap">
            <p className="label">Why BloomingRock</p>
            <h1>You shouldn&apos;t have to become an AI expert to get time back.</h1>
            <p className="sub">AI that actually gets used, set up around how you already work.</p>
            <Link className="btn" href={LOOK_PATH}>
              Book a free 15-minute look
            </Link>
          </div>
        </section>

        <section className="stone r-section" id="about">
          <div className="wrap">
            <p className="label">About</p>
            <h2>
              BloomingRock keeps up with AI so you don&apos;t have to, and brings
              you the parts that make sense for a small shop.
            </h2>
            <div className="prose">
              <Image
                className="headshot"
                src="/diana.jpg"
                alt="Diana Cervantes, founder of BloomingRock Solutions"
                width={532}
                height={532}
                priority
              />
              <p>
                Most owners don&apos;t fail at AI because the tools are bad. They
                fail because nothing gets wired into the real week. That gap is
                where good intentions gather dust.
              </p>
              <p>
                I help you find one or two places where AI can save real time, set
                it up around how you already work, and hand it off so it actually
                gets used. Not a slide deck of possibilities.
              </p>
              <p>
                With 18 years in SaaS implementation, customer success, and
                enterprise sales engineering, I bring a solution-driven approach,
                not a product pitch. I assess what you need and recommend the best
                path forward: a focused workflow, a better process, or sometimes
                waiting until the timing is right.
              </p>
              <p>
                <a
                  className="text-link"
                  href="https://www.credly.com/badges/c06e0b61-f404-4d6f-88cb-b84a3cb9303d/public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ASIS International member. Verify on Credly.
                </a>
              </p>
            </div>
          </div>
        </section>

        <CtaSection
          title="Let's take a closer look. No charge for the first look."
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
