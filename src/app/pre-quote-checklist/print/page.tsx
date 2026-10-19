import type { Metadata } from "next";
import {
  CHECKLIST_INTRO,
  CHECKLIST_SECTIONS,
  CHECKLIST_TITLE,
} from "../checklist-content";
import { PrintControls } from "./PrintControls";
import "./print.css";

export const metadata: Metadata = {
  title: `${CHECKLIST_TITLE} (print) | BloomingRock Solutions`,
  robots: { index: false, follow: false },
};

export default function PreQuoteChecklistPrintPage() {
  return (
    <div className="checklist-print">
      <header className="checklist-print__header">
        <p className="checklist-print__brand">BloomingRock Solutions</p>
        <h1>{CHECKLIST_TITLE}</h1>
        <p className="checklist-print__intro">{CHECKLIST_INTRO}</p>
        <PrintControls />
      </header>

      {CHECKLIST_SECTIONS.map((section) => (
        <section key={section.title} className="checklist-print__section">
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item) => (
              <li key={item}>
                <span className="checklist-print__box" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="checklist-print__footer">
        {/* DIANA_CONFIRM: print footer domain — Vera flag 4 */}
        <p>bloomingrocksolutions.com · Pre-quote checklist</p>
      </footer>
    </div>
  );
}
