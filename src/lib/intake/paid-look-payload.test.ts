import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PaidLookAnswers } from "@/lib/paid-look-intake";
import { PAID_LOOK_SECTIONS } from "@/lib/intake/paid-look-sections";
import { buildPaidLookInboundPayload } from "@/lib/intake/paid-look-payload.ts";

const sampleAnswers: PaidLookAnswers = {
  shopName: "Acme Fab",
  nameAndRole: "Sam Owner, president",
  email: "sam@acmefab.com",
  phone: "312-555-0100",
  website: "https://acmefab.com/",
  whatYouMake: "Custom steel parts",
  teamAndQuotes: "12 people; 3 touch quotes",
  quotesPerWeek: "6-15",
  quoteSources: ["email", "phone"],
  comesWith: ["drawings", "PDFs"],
  missingUnclear: "Quantity and finish are often missing",
  requestToQuote: "1-3 days",
  buildQuotes: "Excel",
  keepRequests: ["email folders", "shared drive"],
  emailProvider: "Gmail",
  aiTools: ["none"],
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

describe("buildPaidLookInboundPayload", () => {
  it("uses portal section keys and itarCui in filesAndSecurity", () => {
    const payload = buildPaidLookInboundPayload(sampleAnswers, "Sam Owner", []);

    assert.equal(payload.source, "website-paid-look");
    assert.equal(payload.name, "Sam Owner");
    assert.equal(payload.email, sampleAnswers.email);
    assert.equal(payload.business, sampleAnswers.shopName);

    for (const key of Object.keys(PAID_LOOK_SECTIONS.aboutYou)) {
      assert.ok(key in payload.aboutYou, `aboutYou.${key}`);
    }
    assert.equal(payload.filesAndSecurity.itarCui, "no");
    assert.deepEqual(payload.uploads, { files: [] });
    assert.equal(payload.beforeWeStart.readHowIHandleFiles, true);
  });

  it("includes upload files under uploads.files", () => {
    const files = [
      {
        url: "https://example.com/a.pdf",
        name: "a.pdf",
        contentType: "application/pdf",
        size: 100,
      },
    ];
    const payload = buildPaidLookInboundPayload(sampleAnswers, "Sam Owner", files);
    assert.deepEqual(payload.uploads.files, files);
  });
});
