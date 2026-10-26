import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contactNameFromAnswers,
  parsePaidLookIntake,
} from "./paid-look-intake.ts";
import { validatePaidLookUploads } from "./paid-look-intake-upload.ts";

const baseInput = {
  shopName: "Acme Fab",
  nameAndRole: "Sam Owner, president",
  email: "sam@acmefab.com",
  phone: "312-555-0100",
  website: "acmefab.com",
  whatYouMake: "Custom steel parts",
  teamAndQuotes: "12 people; 3 touch quotes",
  quotesPerWeek: "6-15",
  quoteSources: ["email", "phone"],
  quoteSourcesOther: "",
  comesWith: ["drawings", "PDFs"],
  missingUnclear: "Quantity and finish are often missing",
  requestToQuote: "1-3 days",
  buildQuotes: "Excel",
  buildQuotesErpName: "",
  buildQuotesOther: "",
  keepRequests: ["email folders", "shared drive"],
  emailProvider: "Gmail",
  emailProviderOther: "",
  aiTools: ["none"],
  aiToolsOther: "",
  itar: "no",
  viewOnlyAccount: "yes",
  loopIn: "",
  stuckLongest: "Chasing missing drawings",
  lostJobSlowQuote: "Lost a rush job last month",
  trustNewTools: "Office manager",
  magicWand: "One inbox for every RFQ",
  ackFilesHandling: true,
  ackNda: true,
  walkthroughTimes: "Tue/Thu mornings",
};

describe("parsePaidLookIntake", () => {
  it("accepts a complete intake", () => {
    const result = parsePaidLookIntake(baseInput);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.answers.shopName, "Acme Fab");
      assert.equal(result.contactName, "Sam Owner");
    }
  });

  it("requires ERP name when ERP/software is selected", () => {
    const result = parsePaidLookIntake({
      ...baseInput,
      buildQuotes: "ERP/software",
      buildQuotesErpName: "",
    });
    assert.equal(result.ok, false);
  });

  it("shows ITAR note trigger values in answers", () => {
    const result = parsePaidLookIntake({ ...baseInput, itar: "not sure" });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.answers.itar, "not sure");
    }
  });
});

describe("contactNameFromAnswers", () => {
  it("uses the name before a comma", () => {
    assert.equal(contactNameFromAnswers("Alex Quoter, sales"), "Alex Quoter");
  });
});

describe("validatePaidLookUploads", () => {
  it("allows zero files", () => {
    assert.deepEqual(validatePaidLookUploads([]), { ok: true });
  });

  it("rejects too many files", () => {
    const files = [new File(["a"], "a.pdf"), new File(["b"], "b.pdf"), new File(["c"], "c.pdf"), new File(["d"], "d.pdf")];
    const result = validatePaidLookUploads(files);
    assert.equal(result.ok, false);
  });
});
