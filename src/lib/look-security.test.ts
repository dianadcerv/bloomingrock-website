import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createFormToken,
  isValidEmail,
  normalizeWebsite,
  sanitizeMultiline,
  sanitizeOneLine,
  SlidingWindowLimiter,
  verifyFormToken,
} from "./look-security.ts";

describe("sanitizeOneLine", () => {
  it("strips CR/LF and other control characters", () => {
    assert.equal(sanitizeOneLine("Acme\r\nBcc: evil@x.com"), "AcmeBcc: evil@x.com");
  });
});

describe("sanitizeMultiline", () => {
  it("keeps newlines but drops other control characters", () => {
    assert.equal(sanitizeMultiline("line1\r\nline2\u0000"), "line1\nline2");
  });
});

describe("isValidEmail", () => {
  it("accepts a normal work email", () => {
    assert.equal(isValidEmail("owner@example.com"), true);
  });

  it("rejects header injection and spaces", () => {
    assert.equal(isValidEmail("owner@example.com\r\nCc: evil@x.com"), false);
    assert.equal(isValidEmail("not an email"), false);
  });
});

describe("normalizeWebsite", () => {
  it("adds https and accepts http(s) only", () => {
    assert.deepEqual(normalizeWebsite("example.com"), {
      ok: true,
      url: "https://example.com/",
    });
    assert.equal(normalizeWebsite("https://example.com/path").ok, true);
    const empty = normalizeWebsite("");
    assert.equal(empty.ok, true);
    assert.equal(empty.ok && empty.url, "");
  });

  it("rejects non-http schemes and credentials", () => {
    assert.equal(normalizeWebsite("javascript:alert(1)").ok, false);
    assert.equal(normalizeWebsite("data:text/html,hi").ok, false);
    assert.equal(normalizeWebsite("https://user:pass@example.com").ok, false);
  });
});

describe("form token", () => {
  const secret = "test-secret";

  it("accepts a token after the minimum age", () => {
    const created = 1_000_000;
    const token = createFormToken(created, secret);
    assert.equal(
      verifyFormToken(token, { now: created + 3_000, secret, minAgeMs: 2_500 }),
      true,
    );
  });

  it("rejects instant reuse and tampering", () => {
    const created = 1_000_000;
    const token = createFormToken(created, secret);
    assert.equal(verifyFormToken(token, { now: created + 200, secret }), false);
    assert.equal(verifyFormToken(`${created}.deadbeef`, { now: created + 3_000, secret }), false);
  });
});

describe("SlidingWindowLimiter", () => {
  it("allows up to max then blocks inside the window", () => {
    const limiter = new SlidingWindowLimiter(1_000, 2);
    assert.equal(limiter.consume("ip", 0), true);
    assert.equal(limiter.consume("ip", 10), true);
    assert.equal(limiter.consume("ip", 20), false);
    assert.equal(limiter.consume("ip", 1_011), true);
  });
});
