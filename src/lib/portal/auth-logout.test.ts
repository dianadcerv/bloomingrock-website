import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../../app/portal/auth/logout/route.ts";

describe("portal logout route", () => {
  it("does not clear session on GET (prefetch-safe)", async () => {
    const response = await GET();
    assert.equal(response.status, 405);
  });
});
