import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHECKLIST_SECTIONS,
  CHECKLIST_TITLE,
  buildChecklistPlainText,
} from "./checklist-content";

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
  });
});
