import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOOK_PATH } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About | BloomingRock Solutions",
  description:
    "BloomingRock helps small business owners find one or two places where AI can save real time — then set it up around how they already work so it actually gets used.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section className="page-hero" aria-label="About">
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

          <SiteHeader onDark current="about" />

          <div className="page-hero__content">
            <p className="page-hero__brand">BloomingRock</p>
            <h1 className="page-hero__headline">Why BloomingRock</h1>
            <p className="page-hero__support">
              AI that actually gets used — set up around how you already work.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" href={LOOK_PATH}>
                Book a free 15-minute look
              </Link>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="why-bloomingrock">
          <div className="section__inner reveal">
            <p className="section__eyebrow">About</p>
            <h2 className="section__title">
              You shouldn’t have to become an AI expert to get time back.
            </h2>
            <div className="about-copy">
              <p>
                AI is moving into every part of how we live and work — including
                how small businesses follow up with customers, schedule jobs,
                and keep admin from eating the week. Tools are getting smarter;
                so is the noise. Most owners don’t fail at AI because the tools
                are bad. They fail because nothing gets wired into the real
                week. That gap is where good intentions gather dust.
              </p>
              <p>
                BloomingRock sits at the practical edge of AI so you do not. We
                help you find one or two places where AI can save real time, set
                it up around how you already work, and hand it off so it
                actually gets used — not a slide deck of possibilities.
              </p>
              <p>
                With 18 years in SaaS implementation, customer success, and
                enterprise sales engineering, I bring a solution-driven approach
                — not a product pitch. I assess what you need and recommend the
                best path forward: a focused workflow, a better process, or
                sometimes waiting until the timing is right. I work with small
                business owners who need results without another project that
                never finishes.
              </p>
              <div className="about-credential">
                <a
                  className="about-credential__link"
                  href="https://www.credly.com/badges/c06e0b61-f404-4d6f-88cb-b84a3cb9303d/public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="about-credential__badge"
                    src="/badges/asis-member.png"
                    alt="ASIS International Member badge"
                    width={120}
                    height={120}
                  />
                  <span className="about-credential__label">
                    ASIS International member. Verify on Credly.
                  </span>
                </a>
              </div>
            </div>
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
