import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const PAGE_TITLE =
  "Why AI setups gather dust, and what helps them stick | BloomingRock Solutions";
const PAGE_DESCRIPTION =
  "An AI demo can look great and still leave you with nothing you use on Monday. Research from manufacturing groups and small-business surveys helps explain that gap, and it points to a better way to start.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/make-ai-stick/why-setups-gather-dust" },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export default function WhySetupsGatherDustPage() {
  return (
    <div className="site">
      <SiteHeader current="make-ai-stick" />
      <main className="site-main">
        <section
          className="moss r-section hero hero--compact"
          aria-label="Why AI setups gather dust"
        >
          <div className="wrap">
            <p className="label">Research</p>
            <h1>Why AI setups gather dust, and what helps them stick</h1>
            <p className="sub">
              An AI demo can look great and still leave you with nothing you use
              on Monday. Research from manufacturing groups and small-business
              surveys helps explain that gap, and it points to a better way to
              start.
            </p>
          </div>
        </section>

        <section className="stone r-section" id="article">
          <div className="wrap">
            <div className="prose prose-article">
              <p>
                Maybe you bought a subscription. Maybe your team went to a
                workshop. Someone tried a few prompts, got a good answer, and
                meant to come back to it.
              </p>
              <p>Then the next rush job came in.</p>
              <p>
                That doesn&apos;t mean AI can&apos;t help. It means it&apos;s
                worth looking at what happened between trying the tool and using
                it in the work.
              </p>

              <h2>Trying it and using it aren&apos;t the same thing</h2>
              <p>
                In a{" "}
                <a href="https://manufacturingleadershipcouncil.com/wp-content/uploads/2025/05/Shaping-the-AI-Powered-Factory-of-the-Future-Report.pdf">
                  2025 survey from the Manufacturing Leadership Council, a
                  division of the National Association of Manufacturers
                </a>
                , 66% of respondents said they had difficulty scaling AI pilots
                into full production. And 78% named legacy systems, poor
                connectivity, or integration as a challenge.
              </p>
              <p>
                Those numbers describe the people who answered that survey, not
                every manufacturer. They also don&apos;t mean 66% of projects
                failed. They do show that getting past the trial stage is a real
                concern in manufacturing.
              </p>
              <p>
                How AI connects to the everyday work matters too.{" "}
                <a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value">
                  McKinsey&apos;s March 2025 research
                </a>{" "}
                found that out of 25 factors it tested, redesigning workflows
                had the strongest link to reported profit impact. But only 21%
                of respondents whose organizations used generative AI said
                they&apos;d fundamentally redesigned at least some workflows.
              </p>
              <p>
                That&apos;s a pattern in survey answers, not proof that changing
                a process guarantees a return. Still, it points to a better
                question than &quot;Which AI tool should we buy?&quot;
              </p>
              <p>
                Where does the work get stuck, and what would need to change?
              </p>

              <h2>Why this is hard in a small shop</h2>
              <p>
                A small team has to find time to learn while the work keeps
                coming.
              </p>
              <p>
                The{" "}
                <a href="https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-6.html">
                  OECD&apos;s 2025 research on small and medium-sized
                  businesses
                </a>{" "}
                puts it plainly. With fewer employees, small businesses have
                less flexibility to pull someone off revenue-generating work for
                training.
              </p>
              <p>
                Among businesses in that survey that weren&apos;t using
                generative AI, 49.8% said employees didn&apos;t have the right
                skills. And 52.5% were concerned about what happens to
                information entered into the tools.
              </p>
              <p>
                That research covered seven countries, not just U.S.
                manufacturers. But those are practical worries, and they deserve
                real answers. Who has time to learn this? Can we use it with
                customer information? Who checks the answer?
              </p>
              <p>
                A good demo also doesn&apos;t tell you whether the setup fits
                the job. Sometimes the tool really is the wrong one. Messy
                source information, unreliable answers, and no connection to the
                systems you already use can all get in the way.
              </p>
              <p>
                Kathie Mahoney, president of MassMEP, said it well in a{" "}
                <a href="https://www.manufacturingdive.com/news/massachusetts-mep-president-mahoney-manufacturing-technology-evolution/822723/">
                  June 2026 Manufacturing Dive interview
                </a>
                :
              </p>
              <blockquote>
                <p>
                  {"\u201c"}It{"\u2019"}s more about the people and how do you
                  integrate everything.{"\u201d"}
                </p>
              </blockquote>
              <p>
                To me, that means listening to the people doing the job before
                deciding what to build.
              </p>

              <h2>Start with one job worth fixing</h2>
              <p>
                <a href="https://www.nist.gov/system/files/documents/2025/07/11/Artificial%20Intelligence-%20Key%20Consideration%20and%20Effective%20Implementation%20Strategies%20508%20Compliant.pdf">
                  NIST&apos;s guidance for smaller manufacturers
                </a>{" "}
                recommends starting with a focused problem, getting the data
                ready, and building support among supervisors and the people
                who&apos;ll use it.
              </p>
              <p>In a small shop, here&apos;s how I&apos;d put that into practice.</p>
              <p>
                <strong>Follow one recurring task.</strong> Watch how a request
                moves from the inbox to the person who has to act on it. Look
                for the reading, copying, searching, and chasing that happens
                over and over. Ask whether a checklist or a simple automation
                would fix it before you add AI.
              </p>
              <p>
                <strong>Pick one result that matters.</strong> Choose a task that
                happens often enough to test. Decide what better would look like,
                like less time gathering quote information, without promising a
                number before you&apos;ve measured it.
              </p>
              <p>
                <strong>
                  Use the tools your team already knows, when it makes sense.
                </strong>{" "}
                If your current software can handle the next step safely, put it
                there. Don&apos;t make keeping a second system updated part of
                someone&apos;s job without a good reason.
              </p>
              <p>
                <strong>Let a trusted person try it first.</strong> Ask the
                estimator or office lead who knows all the exceptions to test it
                on real work. Give them room to say what&apos;s wrong. Their
                judgment should shape the setup.
              </p>
              <p>
                <strong>Make ownership part of the handoff.</strong> Name who
                checks the output, who keeps the instructions current, and what
                happens when something breaks. Keep a way to do the task without
                AI.
              </p>
              <p>
                In a{" "}
                <a href="https://www.designnews.com/automation/deloitte-expert-says-ai-enhances-manufacturing-instead-of-replacing-human-workers">
                  2026 Design News interview
                </a>
                , Tim Gaus, Deloitte&apos;s smart manufacturing leader, put the
                ownership question this way:
              </p>
              <blockquote>
                <p>
                  {"\u201c"}They don{"\u2019"}t want to be reliant on a partner
                  for their entire journey.{"\u201d"}
                </p>
              </blockquote>
              <p>
                A good handoff helps your team run the work on their own,
                including knowing when to ask for help.
              </p>

              <h2>Example: getting a quote request ready</h2>
              <p className="example-label">
                <em>
                  This is a made-up example to show the idea. It isn&apos;t a
                  BloomingRock client project or a measured result.
                </em>
              </p>
              <p>
                Picture a small fab shop. A request comes in with an email
                thread, a PDF spec, and two drawing revisions. The estimator has
                to pull the details together before pricing can start.
              </p>
              <p>
                The first task could be an intake summary in the shop&apos;s
                existing job folder or spreadsheet. Using approved tools, AI
                could draft a list of the requested quantities, the documents
                supplied, and the open questions, with links back to the source
                material.
              </p>
              <p>
                The estimator checks every entry against the originals. Anything
                missing or conflicting stays flagged. Pricing and technical calls
                stay with the people responsible for them.
              </p>
              <p>
                Before trying it, the shop writes down how long prep takes
                today. During the trial, it tracks review time, corrections, and
                whether the team actually uses the summary.
              </p>
              <p>
                If checking it takes longer than doing the task the old way, the
                setup needs work. If a checklist works better, use the checklist.
              </p>

              <h2>Make it useful in a normal week</h2>
              <p>
                The research says to look past the demo. Fit, reliable
                information, training, and ownership all need attention.
              </p>
              <p>
                In your shop, the place to start can be one recurring problem
                and the person who knows it best.
              </p>
              <p>
                If you&apos;d like to look at one together,{" "}
                <Link href="/look">Book a Look</Link>. I&apos;ll start with
                how the work gets done today.
              </p>

              <h3>Sources</h3>
              <ol className="sources">
                <li>
                  Manufacturing Leadership Council / NAM,{" "}
                  <em>Shaping the AI-Powered Factory of the Future</em>, May
                  2025, pp. 20-22 and methodology p. 27.{" "}
                  <a href="https://manufacturingleadershipcouncil.com/wp-content/uploads/2025/05/Shaping-the-AI-Powered-Factory-of-the-Future-Report.pdf">
                    Report
                  </a>
                  .
                </li>
                <li>
                  McKinsey,{" "}
                  <em>
                    The state of AI: How organizations are rewiring to capture
                    value
                  </em>
                  , March 12, 2025. Fieldwork July 2024.{" "}
                  <a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value">
                    Research
                  </a>
                  .
                </li>
                <li>
                  OECD, <em>Generative AI and the SME Workforce</em>, November
                  5, 2025.{" "}
                  <a href="https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-6.html">
                    Preparedness chapter
                  </a>{" "}
                  and{" "}
                  <a href="https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-3.html">
                    methodology
                  </a>
                  .
                </li>
                <li>
                  Cole Rosengren,{" "}
                  <em>
                    MassMEP president talks AI adoption, funding and the
                    evolving industry
                  </em>
                  , Manufacturing Dive, June 16, 2026.{" "}
                  <a href="https://www.manufacturingdive.com/news/massachusetts-mep-president-mahoney-manufacturing-technology-evolution/822723/">
                    Interview
                  </a>
                  .
                </li>
                <li>
                  NIST,{" "}
                  <em>
                    Artificial Intelligence: Key Consideration and Effective
                    Implementation Strategies
                  </em>
                  , hosted July 2025.{" "}
                  <a href="https://www.nist.gov/system/files/documents/2025/07/11/Artificial%20Intelligence-%20Key%20Consideration%20and%20Effective%20Implementation%20Strategies%20508%20Compliant.pdf">
                    Guide
                  </a>
                  .
                </li>
                <li>
                  Rob Spiegel,{" "}
                  <em>
                    Deloitte Expert Says AI Enhances Manufacturing Instead of
                    Replacing Human Workers
                  </em>
                  , Design News, March 5, 2026.{" "}
                  <a href="https://www.designnews.com/automation/deloitte-expert-says-ai-enhances-manufacturing-instead-of-replacing-human-workers">
                    Interview
                  </a>
                  .
                </li>
              </ol>

            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
