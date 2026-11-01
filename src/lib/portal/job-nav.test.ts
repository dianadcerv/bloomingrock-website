import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JOBS } from "@/lib/portal/demo-data";
import { getJobSubnavLinks } from "@/lib/portal/job-nav";
import { isJobDocumentsNavActive, jobDocumentsHref } from "@/lib/portal/job-documents";

describe("getJobSubnavLinks", () => {
  const stair = JOBS.find((j) => j.id === "access-platform")!;

  it("keeps document outputs off the shop tab bar", () => {
    const labels = getJobSubnavLinks(stair, "shop-admin").map((l) => l.label);
    assert.equal(labels.includes("Sign-off"), false);
    assert.equal(labels.includes("BOM"), false);
    assert.equal(labels.includes("Documents"), true);
    assert.deepEqual(labels, [
      "Workspace",
      "Sources",
      "Workflow",
      "Missing info",
      "Knowledge",
      "Audit",
      "Documents",
    ]);
  });

  it("gives buyers workspace, workflow, and documents", () => {
    const labels = getJobSubnavLinks(stair, "buyer").map((l) => l.label);
    assert.deepEqual(labels, ["Workspace", "Workflow", "Documents"]);
  });
});

describe("isJobDocumentsNavActive", () => {
  it("highlights Documents for hub and output routes", () => {
    const jobId = "access-platform";
    assert.equal(isJobDocumentsNavActive(jobDocumentsHref(jobId), jobId), true);
    assert.equal(isJobDocumentsNavActive(`/jobs/${jobId}/sign-off`, jobId), true);
    assert.equal(isJobDocumentsNavActive(`/jobs/${jobId}/workflow`, jobId), false);
  });
});
