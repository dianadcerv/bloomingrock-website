"use client";

import { useId } from "react";
import {
  CHECKLIST_INTRO,
  CHECKLIST_META_FIELDS,
  CHECKLIST_SECTIONS,
  CHECKLIST_TITLE,
} from "./checklist-content";
import { ChecklistEmptyBox } from "./ChecklistEmptyBox";
import { ChecklistRuleLine } from "./ChecklistRuleLine";
import { ChecklistSectionNotes } from "./ChecklistSectionNotes";
import "./checklist.css";

type ChecklistInteractiveProps = {
  /** Tighter heading when nested in the download form success state. */
  variant?: "default" | "embedded";
  showBrand?: boolean;
};

export function ChecklistInteractive({
  variant = "default",
  showBrand = false,
}: ChecklistInteractiveProps) {
  const baseId = useId();

  return (
    <article
      className={`checklist-doc${variant === "embedded" ? " checklist-doc--embedded" : ""}`}
      aria-labelledby={`${baseId}-title`}
    >
      {showBrand ? (
        <p className="checklist-doc__brand">BloomingRock Solutions</p>
      ) : null}
      <h2 id={`${baseId}-title`} className="checklist-doc__title">
        {CHECKLIST_TITLE}
      </h2>

      <div className="checklist-doc__meta" role="group" aria-label="Job meta">
        {CHECKLIST_META_FIELDS.map((field) => (
          <p key={field.id} className="checklist-doc__meta-row">
            <span className="checklist-doc__meta-label">{field.label}</span>
            <span className="checklist-doc__meta-rule" aria-hidden="true">
              <ChecklistRuleLine />
            </span>
          </p>
        ))}
      </div>

      <p className="checklist-doc__intro">{CHECKLIST_INTRO}</p>

      {CHECKLIST_SECTIONS.map((section, sectionIndex) => {
        const sectionId = `${baseId}-section-${sectionIndex}`;
        return (
          <section
            key={section.title}
            className="checklist-doc__section"
            aria-labelledby={sectionId}
          >
            <h3 id={sectionId} className="checklist-doc__section-title">
              {section.title}
            </h3>
            <ul className="checklist-doc__items">
              {section.items.map((item, itemIndex) => {
                const inputId = `${baseId}-item-${sectionIndex}-${itemIndex}`;
                return (
                  <li key={item} className="checklist-doc__item">
                    <label className="checklist-doc__item-label" htmlFor={inputId}>
                      <input
                        id={inputId}
                        className="checklist-doc__checkbox-input"
                        type="checkbox"
                      />
                      <ChecklistEmptyBox />
                      <span>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <ChecklistSectionNotes />
          </section>
        );
      })}
    </article>
  );
}