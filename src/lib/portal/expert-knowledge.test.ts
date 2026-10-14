import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getKnowledgeSuggestionsForJob } from "./expert-knowledge.ts";

describe("knowledge suggestions", () => {
  it("never suggests a tip on its origin job", () => {
    for (const jobId of ["access-platform", "machine-guard", "warehouse-b-stair"]) {
      const tips = getKnowledgeSuggestionsForJob(jobId);
      assert.ok(tips.every((t) => t.originJobId !== jobId));
    }
  });

  it("surfaces cross-job tips for demo jobs", () => {
    assert.ok(getKnowledgeSuggestionsForJob("access-platform").some((t) => t.id === "tip-galv-stairs"));
    assert.ok(getKnowledgeSuggestionsForJob("warehouse-b-stair").some((t) => t.id === "tip-meridian-anchors"));
    assert.ok(getKnowledgeSuggestionsForJob("machine-guard").some((t) => t.id === "tip-meridian-anchors"));
    assert.ok(getKnowledgeSuggestionsForJob("access-platform").some((t) => t.id === "tip-platform-load"));
  });
});
