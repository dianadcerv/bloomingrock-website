import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getJob, getProject } from "./demo-data.ts";
import {
  buyerCustomerIdForEmail,
  jobsForSession,
  sessionCanAccessJob,
} from "./access.ts";

function jobCustomerId(job: NonNullable<ReturnType<typeof getJob>>) {
  const project = getProject(job.projectId);
  return project?.customerId ?? null;
}

describe("buyer job access", () => {
  it("scopes jobs per customer login", () => {
    const jordan = {
      email: "jordan@meridian.demo",
      role: "buyer" as const,
      name: "Jordan Hale",
      org: "Meridian",
      title: "Plant engineer",
      exp: 0,
    };
    const alex = {
      email: "alex@harborview.demo",
      role: "buyer" as const,
      name: "Alex Rivera",
      org: "Harborview",
      title: "Facilities",
      exp: 0,
    };

    assert.equal(buyerCustomerIdForEmail(jordan.email), "meridian");
    assert.equal(buyerCustomerIdForEmail(alex.email), "harborview");

    assert.equal(sessionCanAccessJob(jordan, "access-platform"), true);
    assert.equal(sessionCanAccessJob(jordan, "warehouse-b-stair"), false);
    assert.equal(sessionCanAccessJob(alex, "warehouse-b-stair"), true);
    assert.equal(sessionCanAccessJob(alex, "machine-guard"), false);

    assert.equal(jobsForSession(jordan).length, 2);
    assert.equal(jobsForSession(alex).length, 2);
    assert.ok(jobsForSession(alex).some((j) => j.id === "warehouse-b-stair"));
    assert.ok(jobsForSession(alex).some((j) => j.id === "itar-mezz-guard"));
  });

  it("maps harbor job to harborview customer", () => {
    const job = getJob("warehouse-b-stair");
    assert.ok(job);
    assert.equal(jobCustomerId(job!), "harborview");
  });

  it("keeps heater shop staff off northridge jobs", () => {
    const alexEngineer = {
      email: "alex@heaterco.demo",
      role: "shop" as const,
      name: "Alex Kim",
      org: "Heater Co. (demo)",
      title: "Applications engineer",
      exp: 0,
    };
    const jobs = jobsForSession(alexEngineer);
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0]?.id, "lakeshore-cartridge-heaters");
    assert.equal(sessionCanAccessJob(alexEngineer, "access-platform"), false);
    assert.equal(sessionCanAccessJob(alexEngineer, "lakeshore-cartridge-heaters"), true);
  });

  it("scopes lakeshore buyer to heater job only", () => {
    const priya = {
      email: "priya@lakeshore.demo",
      role: "buyer" as const,
      name: "Priya N. Shah",
      org: "Lakeshore Mold Systems, Inc.",
      title: "Purchasing",
      exp: 0,
    };
    assert.equal(buyerCustomerIdForEmail(priya.email), "lakeshore");
    const jobs = jobsForSession(priya);
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0]?.buyerStatusLabel, "Waiting on shop for clarifications");
    assert.ok(jobs[0]?.questions.every((q) => !q.sent));
  });
});