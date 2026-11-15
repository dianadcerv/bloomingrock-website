import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { consumeFormSubmitLimits, consumePaidLookUploadLimit } from "./form-rate-limit.ts";
import { SlidingWindowLimiter } from "./sliding-window-limiter.ts";

describe("consumeFormSubmitLimits", () => {
  it("blocks after the email limit", () => {
    const ip = `test-ip-${Date.now()}`;
    const email = `user-${Date.now()}@example.com`;
    assert.equal(consumeFormSubmitLimits(ip, email), true);
    assert.equal(consumeFormSubmitLimits(ip, email), true);
    assert.equal(consumeFormSubmitLimits(ip, email), true);
    assert.equal(consumeFormSubmitLimits(ip, email), false);
  });
});

describe("paid look upload limiter", () => {
  it("allows three upload attempts per hour then blocks", () => {
    const limiter = new SlidingWindowLimiter(60_000, 3);
    const key = `upload-ip:test-${Date.now()}`;
    assert.equal(limiter.consume(key, 0), true);
    assert.equal(limiter.consume(key, 1), true);
    assert.equal(limiter.consume(key, 2), true);
    assert.equal(limiter.consume(key, 3), false);
  });

  it("exposes a module-level upload gate", () => {
    const ip = `upload-${Date.now()}`;
    assert.equal(consumePaidLookUploadLimit(ip), true);
  });
});