import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPaidLookFallbackUploadsHtml } from "./paid-look-fallback-email.ts";

describe("buildPaidLookFallbackUploadsHtml", () => {
  it("returns empty when there are no uploads", () => {
    assert.equal(buildPaidLookFallbackUploadsHtml(0, [], "no"), "");
  });

  it("lists count and names when not controlled", () => {
    const html = buildPaidLookFallbackUploadsHtml(2, ["a.pdf", "b.png"], "no");
    assert.match(html, /Uploads:/);
    assert.match(html, /2 file\(s\)/);
    assert.match(html, /a\.pdf/);
    assert.match(html, /b\.png/);
    assert.match(html, /stored privately/);
    assert.doesNotMatch(html, /<a /);
  });

  it("escapes file names in HTML", () => {
    const html = buildPaidLookFallbackUploadsHtml(
      1,
      ['evil<img src="x" onerror="alert(1)">.pdf'],
      "no",
    );
    assert.match(html, /&lt;img/);
    assert.doesNotMatch(html, /<img/);
  });

  it("omits file names for ITAR yes", () => {
    const html = buildPaidLookFallbackUploadsHtml(2, ["secret.pdf", "x.png"], "yes");
    assert.match(html, /controlled submission/);
    assert.match(html, /2 file\(s\)/);
    assert.doesNotMatch(html, /secret\.pdf/);
    assert.doesNotMatch(html, /x\.png/);
  });

  it("omits file names for ITAR not sure", () => {
    const html = buildPaidLookFallbackUploadsHtml(1, ["maybe.pdf"], "not sure");
    assert.match(html, /controlled submission/);
    assert.doesNotMatch(html, /maybe\.pdf/);
  });
});
