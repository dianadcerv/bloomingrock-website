import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getJob } from "./demo-data.ts";

describe("checklist provenance demo data", () => {
  it("includes institutional, extracted, and interpretation markers on access platform", () => {
    const job = getJob("access-platform");
    assert.ok(job);
    const kinds = new Set<string>();
    for (const item of job!.checklist) {
      for (const mark of item.provenance ?? []) {
        kinds.add(mark.type);
      }
    }
    assert.ok(kinds.has("institutional"));
    assert.ok(kinds.has("extracted"));
    assert.ok(kinds.has("interpretation"));
  });

  it("labels rail height as institutional knowledge with author", () => {
    const job = getJob("access-platform")!;
    const rail = job.checklist.find((c) => c.id === "rail-height");
    const inst = rail?.provenance?.find((m) => m.type === "institutional");
    assert.ok(inst && inst.type === "institutional");
    assert.equal(inst.addedBy, "Maya Chen");
  });
});
