import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { mintFormToken } from "@/lib/look-security";
import { ChecklistForm } from "./ChecklistForm";

const PAGE_TITLE = "Pre-quote checklist for custom jobs | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "A one-page checklist for small fab and machine shops. Drawings, material, quantity, tolerances, finish, due date, and contact, all gathered before you price the job.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/pre-quote-checklist",
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

export default async function PreQuoteChecklistPage() {
  const formToken = await mintFormToken();

  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section
          className="page-hero"
          aria-label="Pre-quote checklist for custom jobs"
        >
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
              Gather the details before you quote
            </h1>
          </div>
        </section>

        <section className="section section--stone" id="intro">
          <div className="section__inner reveal">
            <div className="about-copy">
              <p>
                A quote can sit for days waiting on a missing drawing, revision,
                or call note. The math is rarely the slow part. This checklist
                builds on what I wrote in{" "}
                <Link className="text-link" href="/quotes-stall">
                  why quotes stall
                </Link>
                : one short list you fill in before anyone opens the quoting
                sheet.
              </p>
              <p>
                Grab the printable version below. If you want help setting up
                intake around how requests actually reach your shop,{" "}
                <Link className="text-link" href="/look">
                  book a free 15-minute look
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="section section--moss" id="checklist-form">
          <div className="section__inner look-panel reveal">
            <ChecklistForm
              formToken={formToken}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
