import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buyerCustomerIdForEmail,
  jobCustomerId,
  jobsForSession,
  sessionCanAccessJob,
} from "./access.ts";
import { getJob } from "./demo-data.ts";

describe("buyer job access", () => {
  it("scopes jobs per customer login", () => {
    const jordan = {
      email: "jordan@meridian.demo",
      role: "buyer" as const,
      name: "Jordan Hale",
      org: "Meridian Food Plants",
      title: "Plant engineer",
      exp: Date.now() + 1000,
    };
    const alex = {
      email: "alex@harborview.demo",
      role: "buyer" as const,
      name: "Alex Rivera",
      org: "Harborview Logistics",
      title: "Facilities manager",
      exp: Date.now() + 1000,
    };

    assert.equal(buyerCustomerIdForEmail(jordan.email), "meridian");
    assert.equal(buyerCustomerIdForEmail(alex.email), "harborview");

    assert.equal(sessionCanAccessJob(jordan, "access-platform"), true);
    assert.equal(sessionCanAccessJob(jordan, "warehouse-b-stair"), false);
    assert.equal(sessionCanAccessJob(alex, "warehouse-b-stair"), true);
    assert.equal(sessionCanAccessJob(alex, "machine-guard"), false);

    assert.equal(jobsForSession(jordan).length, 2);
    assert.equal(jobsForSession(alex).length, 1);
    assert.ok(jobsForSession(alex).some((j) => j.id === "warehouse-b-stair"));
  });

  it("maps harbor job to harborview customer", () => {
    const job = getJob("warehouse-b-stair");
    assert.ok(job);
    assert.equal(jobCustomerId(job!), "harborview");
  });
});
