import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAppHost,
  isMarketingPath,
  isPortalPath,
  toInternalPortalPath,
} from "./hosts.ts";

describe("isAppHost", () => {
  it("matches the production app host and local app.localhost", () => {
    assert.equal(isAppHost("app.bloomingrocksolutions.com"), true);
    assert.equal(isAppHost("app.localhost:3000"), true);
    assert.equal(isAppHost("www.bloomingrocksolutions.com"), false);
    assert.equal(isAppHost("localhost:3000"), false);
  });
});

describe("portal paths", () => {
  it("treats login and dashboard as portal, not marketing", () => {
    assert.equal(isPortalPath("/login"), true);
    assert.equal(isPortalPath("/jobs/access-platform/bom"), true);
    assert.equal(isPortalPath("/about"), false);
    assert.equal(isMarketingPath("/capabilities"), true);
    assert.equal(toInternalPortalPath("/dashboard"), "/portal/dashboard");
    assert.equal(toInternalPortalPath("/"), "/portal");
  });
});
