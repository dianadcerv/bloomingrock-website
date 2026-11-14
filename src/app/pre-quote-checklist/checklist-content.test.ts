import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHECKLIST_META_FIELDS,
  CHECKLIST_SECTION_NOTES_LABEL,
  CHECKLIST_SECTION_NOTES_LINE_COUNT,
  CHECKLIST_SECTIONS,
  CHECKLIST_TITLE,
  PLAIN_TEXT_CHECKBOX,
  buildChecklistPlainText,
} from "./checklist-content";

const PLAIN_TEXT_BLANK_LINE = "________________________________________";

describe("buildChecklistPlainText", () => {
  it("includes the title and every checklist item", () => {
    const text = buildChecklistPlainText();

    assert.ok(text.startsWith(CHECKLIST_TITLE));
    for (const section of CHECKLIST_SECTIONS) {
      assert.ok(text.includes(section.title));
      for (const item of section.items) {
        assert.ok(text.includes(item));
      }
    }
  });

  it("uses checkbox markers for each line item", () => {
    const text = buildChecklistPlainText();
    const itemCount = CHECKLIST_SECTIONS.reduce(
      (sum, section) => sum + section.items.length,
      0,
    );
    assert.equal((text.match(/\[ \]/g) ?? []).length, itemCount);
    assert.equal(PLAIN_TEXT_CHECKBOX, "[ ]");
  });

  it("includes prepared-by, date, and section notes lines", () => {
    const text = buildChecklistPlainText();
    for (const field of CHECKLIST_META_FIELDS) {
      assert.ok(text.includes(`${field.label}:`));
    }
    const notesCount = (text.match(
      new RegExp(`${CHECKLIST_SECTION_NOTES_LABEL}:`, "g"),
    ) ?? []).length;
    assert.equal(notesCount, CHECKLIST_SECTIONS.length);
  });

  it("adds two underscore lines under each Notes label", () => {
    const text = buildChecklistPlainText();
    const sections = text.split("\n\n");
    const bodySections = sections.filter((block) =>
      CHECKLIST_SECTIONS.some((section) => block.startsWith(section.title)),
    );

    assert.equal(bodySections.length, CHECKLIST_SECTIONS.length);
    for (const block of bodySections) {
      const notesIndex = block.indexOf(`${CHECKLIST_SECTION_NOTES_LABEL}:`);
      assert.ok(notesIndex >= 0);
      const notesTail = block.slice(notesIndex);
      const blankLines = (
        notesTail.match(new RegExp(PLAIN_TEXT_BLANK_LINE, "g")) ?? []
      ).length;
      assert.equal(blankLines, CHECKLIST_SECTION_NOTES_LINE_COUNT);
    }
  });
});