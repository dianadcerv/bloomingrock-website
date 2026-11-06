import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { resolveCommandCenterBaseUrl } from "./intake-inbound.ts";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
const ORIGINAL_CC = process.env.COMMAND_CENTER_URL;

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  if (ORIGINAL_CC === undefined) {
    delete process.env.COMMAND_CENTER_URL;
  } else {
    process.env.COMMAND_CENTER_URL = ORIGINAL_CC;
  }
});

describe("resolveCommandCenterBaseUrl", () => {
  it("returns trimmed COMMAND_CENTER_URL when set", () => {
    process.env.NODE_ENV = "production";
    process.env.COMMAND_CENTER_URL = " https://portal.example.com/ ";
    assert.equal(resolveCommandCenterBaseUrl(), "https://portal.example.com");
  });

  it("returns null in production when unset", () => {
    process.env.NODE_ENV = "production";
    delete process.env.COMMAND_CENTER_URL;
    const error = console.error;
    console.error = () => {};
    try {
      assert.equal(resolveCommandCenterBaseUrl(), null);
    } finally {
      console.error = error;
    }
  });

  it("returns localhost default in development when unset", () => {
    process.env.NODE_ENV = "development";
    delete process.env.COMMAND_CENTER_URL;
    assert.equal(resolveCommandCenterBaseUrl(), "http://localhost:3001");
  });
});
