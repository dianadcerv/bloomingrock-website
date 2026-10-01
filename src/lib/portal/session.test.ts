import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  consumeMagicToken,
  createMagicToken,
  createSessionToken,
  findDemoUser,
  MAGIC_LINK_TTL_MS,
  readSessionToken,
} from "./session.ts";

const key = "test-portal-secret";

describe("demo users", () => {
  it("maps shop and buyer emails", () => {
    assert.equal(findDemoUser("Maya@Northridge.demo")?.role, "shop");
    assert.equal(findDemoUser("jordan@meridian.demo")?.role, "buyer");
    assert.equal(findDemoUser("nobody@example.com"), null);
  });
});

describe("magic tokens", () => {
  it("round-trips a demo email", () => {
    const now = 1_700_000_000_000;
    const token = createMagicToken("maya@northridge.demo", now, key);
    const user = consumeMagicToken(token, now + 1_000, key);
    assert.equal(user?.name, "Maya Chen");
    assert.equal(user?.role, "shop");
  });

  it("rejects expiry and tampering", () => {
    const now = 1_700_000_000_000;
    const token = createMagicToken("jordan@meridian.demo", now, key);
    assert.equal(consumeMagicToken(token, now + MAGIC_LINK_TTL_MS + 1, key), null);
    assert.equal(consumeMagicToken(`${token}x`, now + 1_000, key), null);
  });
});

describe("session tokens", () => {
  it("stores role without making the user an admin", () => {
    const user = findDemoUser("maya@northridge.demo");
    assert.ok(user);
    const token = createSessionToken(user, 10, key);
    const session = readSessionToken(token, 11, key);
    assert.equal(session?.role, "shop");
    assert.equal(session?.title, "Estimator");
  });
});
