import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const PAGE_TITLE = "Quotes stall on the missing details | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "In a small shop, quotes usually wait on a missing drawing, revision, or call note. A short checklist gathers them before anyone prices the job.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/quotes-stall",
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

export default function QuotesStallPage() {
  return (
    <div className="site">
      <RevealObserver />
      <main className="site-main">
        <section className="page-hero" aria-label="Quotes stall on the missing details">
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
              Quotes stall on the missing details
            </h1>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--stone" id="intro">
          <div className="section__inner reveal">
            <div className="about-copy">
              <p>
                In a small shop, quotes don&apos;t usually sit because the price
                is hard to work out. You know your rates. You know roughly what
                the material costs and how long the setup takes.
              </p>
              <p>
                They sit because someone is looking for something. The drawing
                came in as an attachment last week. The customer sent a new
                revision, or maybe that was a different part. The note about the
                tolerance on the bore came from a phone call, and now it lives in
                someone&apos;s head or on a sticky note by the saw.
              </p>
              <p>
                So the quote waits. Not on the math. On the hunting, then a
                callback, then another day because the person who took the call
                is out on the floor.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section section--moss"
          id="gather-first"
          aria-labelledby="gather-first-heading"
        >
          <div className="section__inner reveal">
            <h2 className="section__title" id="gather-first-heading">
              Gather first, then price
            </h2>
            <div className="about-copy">
              <p>
                The fix I like is boring on purpose. Every request goes through
                one short checklist before anyone opens the quoting sheet. It
                doesn&apos;t need new software. It can live in a shared
                spreadsheet tab, a simple form that lands in your inbox, or a
                note pinned in the job folder. Whatever your team already opens
                every day.
              </p>
              <p>
                Start here. Keep it short enough that people will actually fill
                it in.
              </p>
            </div>
            <ul className="scope-list scope-list--in" style={{ marginTop: "1.25rem" }}>
              <li>
                The drawing, saved in the job folder, named so the revision is
                obvious.
              </li>
              <li>
                The revision letter, confirmed with the customer and not guessed
                from the file name.
              </li>
              <li>
                Material and finish, plus anything the customer said they&apos;d
                supply.
              </li>
              <li>
                Quantity, and any other quantities they asked you to price.
              </li>
              <li>
                The due date, and whether it&apos;s a real date or a hope.
              </li>
              <li>Notes from the call, written down next to the drawing.</li>
              <li>
                Who asked, and the best way to reach them with a question.
              </li>
            </ul>
            <div className="about-copy" style={{ marginTop: "1.25rem" }}>
              <p>
                The rule that makes it work is simple. If a line is blank, the
                job doesn&apos;t get priced yet. Someone asks the customer that
                one question first, and the answer goes on the checklist so
                nobody has to ask twice.
              </p>
              <p>
                That&apos;s it. You&apos;re not changing how you price.
                You&apos;re making sure the person pricing has everything in one
                place when they sit down to do it.
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section
          className="section section--stone"
          id="why-one-fix"
          aria-labelledby="why-one-fix-heading"
        >
          <div className="section__inner reveal">
            <h2 className="section__title" id="why-one-fix-heading">
              Why one fix, and why it has to be handed off
            </h2>
            <div className="about-copy">
              <p>
                A checklist like this only helps if it gets used in a normal busy
                week, not just the week someone sets it up. That&apos;s why I
                work the way I do.
              </p>
              <p>
                First I look at how quotes actually come into your shop. Email,
                phone, a customer walking in with a print, a text to the
                owner&apos;s cell. Then I set up one fix in the tools you
                already use. Usually that&apos;s this kind of checklist, shaped
                around what your shop really hunts for. Then I hand it off, so
                your team knows who fills it in, where it lives, and what happens
                when a line is blank. After that it&apos;s yours to run.
              </p>
              <p>
                Once a checklist like this is steady, it&apos;s also a good
                place for AI to help. It could pull the revision and due date out
                of the request email, for example, so someone checks it instead
                of retyping it. But the checklist comes first. AI on top of a
                messy process just makes the mess faster. I wrote more about
                that on the page about{" "}
                <Link className="text-link" href="/make-ai-stick">
                  making AI stick
                </Link>
                .
              </p>
              <p>
                I&apos;m taking on my first few shops now. If your quotes sit for
                the same reasons, what&apos;s the one detail your shop hunts for
                most before a quote can go out?
              </p>
              <p>~Diana</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
