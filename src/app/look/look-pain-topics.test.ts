import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LOOK_PAIN_TOPICS, parseLookPainTopics } from "./look-pain-topics.ts";

describe("parseLookPainTopics", () => {
  it("keeps allowed topics in submission order", () => {
    const result = parseLookPainTopics([
      "Inbox and email triage",
      "Customer follow-up",
    ]);
    assert.deepEqual(result, ["Inbox and email triage", "Customer follow-up"]);
  });

  it("drops unknown values and duplicates", () => {
    const result = parseLookPainTopics([
      "Quoting and estimating",
      "not-a-topic",
      "Quoting and estimating",
      "",
      "Scheduling and capacity",
    ]);
    assert.deepEqual(result, [
      "Quoting and estimating",
      "Scheduling and capacity",
    ]);
  });

  it("lists ten bank topics", () => {
    assert.equal(LOOK_PAIN_TOPICS.length, 10);
  });
});
