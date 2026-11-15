import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loginHrefWithNext, safePortalNextPath } from "./login-redirect.ts";

describe("safePortalNextPath", () => {
  it("allows portal job routes including add-source / notes screens", () => {
    assert.equal(
      safePortalNextPath("/jobs/access-platform/sources"),
      "/jobs/access-platform/sources",
    );
    assert.equal(
      safePortalNextPath("/jobs/access-platform/sources?note=1"),
      "/jobs/access-platform/sources?note=1",
    );
  });

  it("rejects external and non-portal paths", () => {
    assert.equal(safePortalNextPath("https://evil.example/phish"), null);
    assert.equal(safePortalNextPath("//evil.example"), null);
    assert.equal(safePortalNextPath("/about"), null);
    assert.equal(safePortalNextPath("/login"), null);
  });
});

describe("loginHrefWithNext", () => {
  it("encodes a safe next path", () => {
    assert.equal(
      loginHrefWithNext("/jobs/access-platform/sources"),
      "/login?next=%2Fjobs%2Faccess-platform%2Fsources",
    );
    assert.equal(loginHrefWithNext("/about"), "/login");
  });
});
