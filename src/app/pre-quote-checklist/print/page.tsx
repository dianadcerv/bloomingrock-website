import type { Metadata } from "next";
import {
  CHECKLIST_INTRO,
  CHECKLIST_META_FIELDS,
  CHECKLIST_SECTION_NOTES_LABEL,
  CHECKLIST_SECTIONS,
  CHECKLIST_TITLE,
} from "../checklist-content";
import "../checklist.css";
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
        <p className="checklist-doc__brand">BloomingRock Solutions</p>
        <h1 className="checklist-doc__title">{CHECKLIST_TITLE}</h1>

        <div className="checklist-doc__meta" aria-label="Job meta">
          {CHECKLIST_META_FIELDS.map((field) => (
            <p key={field.id} className="checklist-doc__meta-row">
              <span className="checklist-doc__meta-label">{field.label}</span>
              <span className="checklist-doc__meta-line" aria-hidden="true" />
            </p>
          ))}
        </div>

        <p className="checklist-doc__intro">{CHECKLIST_INTRO}</p>
        <PrintControls />
      </header>

      {CHECKLIST_SECTIONS.map((section) => (
        <section key={section.title} className="checklist-doc__section">
          <h2 className="checklist-doc__section-title">{section.title}</h2>
          <ul className="checklist-doc__items">
            {section.items.map((item) => (
              <li key={item} className="checklist-doc__item">
                <span className="checklist-doc__box" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="checklist-doc__notes">
            <span className="checklist-doc__notes-label">
              {CHECKLIST_SECTION_NOTES_LABEL}
            </span>
            <span className="checklist-doc__notes-line" aria-hidden="true" />
          </p>
        </section>
      ))}

      <footer className="checklist-doc__footer">
        <p>bloomingrocksolutions.com · Pre-quote checklist</p>
      </footer>
    </div>
  );
}