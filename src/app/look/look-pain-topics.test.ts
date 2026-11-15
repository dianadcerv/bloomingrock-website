import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LOOK_PAIN_TOPICS,
  lookPainTopicLabels,
  parseLookPainTopics,
} from "./look-pain-topics.ts";

describe("parseLookPainTopics", () => {
  it("keeps allowed topic ids in submission order", () => {
    const result = parseLookPainTopics([
      "inbox-email-triage",
      "customer-follow-up",
    ]);
    assert.deepEqual(result, ["inbox-email-triage", "customer-follow-up"]);
  });

  it("drops unknown values and duplicates", () => {
    const result = parseLookPainTopics([
      "quoting-estimating",
      "not-a-topic",
      "quoting-estimating",
      "",
      "scheduling-capacity",
    ]);
    assert.deepEqual(result, ["quoting-estimating", "scheduling-capacity"]);
  });

  it("lists ten bank topics with kebab-case ids", () => {
    assert.equal(LOOK_PAIN_TOPICS.length, 10);
    assert.equal(LOOK_PAIN_TOPICS[0]?.id, "quoting-estimating");
  });
});

describe("lookPainTopicLabels", () => {
  it("maps ids to human labels for email and details", () => {
    assert.deepEqual(
      lookPainTopicLabels(["quoting-estimating", "customer-follow-up"]),
      ["Quoting / estimating", "Customer follow-up"],
    );
  });
});
