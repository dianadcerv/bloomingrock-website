import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  charCounterAriaLive,
  formatCharCounter,
  WEEK_FIELD_MAX_LENGTH,
  WEEK_NEAR_LIMIT_CHARS,
} from "./look-form-ui.ts";

describe("formatCharCounter", () => {
  it("shows current length and max", () => {
    assert.equal(formatCharCounter(0, WEEK_FIELD_MAX_LENGTH), "0 / 800");
    assert.equal(formatCharCounter(12, WEEK_FIELD_MAX_LENGTH), "12 / 800");
  });
});

describe("charCounterAriaLive", () => {
  it("is silent until the field is near the limit", () => {
    const max = WEEK_FIELD_MAX_LENGTH;
    const near = WEEK_NEAR_LIMIT_CHARS;
    assert.equal(charCounterAriaLive(max - near - 1, max, near), undefined);
    assert.equal(charCounterAriaLive(max - near, max, near), "polite");
    assert.equal(charCounterAriaLive(max, max, near), "polite");
  });
});
