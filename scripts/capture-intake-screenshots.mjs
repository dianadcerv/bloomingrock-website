import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { createMagicToken } from "../src/lib/portal/session.ts";

const key = "bloomingrock-portal-demo";
const out = "/opt/cursor/artifacts/screenshots";
const base = "http://127.0.0.1:3000/portal";
const job = "access-platform";

await mkdir(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function login(page, email) {
  const token = createMagicToken(email, Date.now(), key);
  await page.goto(`${base}/auth/verify?token=${encodeURIComponent(token)}`, {
    waitUntil: "networkidle2",
  });
}

async function shot(page, name, width) {
  await page.setViewport({ width, height: width === 375 ? 900 : 900 });
  await page.screenshot({ path: `${out}/${name}`, fullPage: true });
}

function seedOpenRequest(jobId) {
  return {
    fileRequests: [
      {
        token: "upl-demo-open",
        jobId,
        jobName: "Industrial access platform",
        customerName: "Meridian Food Plants",
        projectName: "Line 3 mezzanine",
        title: "Rev D layouts + photos",
        askDescription: "Please upload updated Rev D PDFs and site photos.",
        status: "open",
        createdAt: "Demo",
        createdBy: "Maya Chen",
      },
    ],
    uploads: [],
    extraInbox: [],
    extraSources: [],
    audit: [],
    phoneIntakes: [],
    websiteQuotes: [],
  };
}

const page = await browser.newPage();
await login(page, "maya@northridge.demo");

await page.goto(`${base}/jobs/${job}`, { waitUntil: "networkidle2" });
await page.evaluate(
  (jobId, state) => {
    sessionStorage.setItem("portal-intake-v1", JSON.stringify(state));
  },
  job,
  seedOpenRequest(job),
);
await page.reload({ waitUntil: "networkidle2" });
await shot(page, "intake-job-upload-open-1280.png", 1280);
await shot(page, "intake-job-upload-open-375.png", 375);

await page.evaluate((jobId) => {
  const state = JSON.parse(sessionStorage.getItem("portal-intake-v1"));
  state.fileRequests[0].orderShippedAtMs = Date.now() - 10 * 86400000;
  sessionStorage.setItem("portal-intake-v1", JSON.stringify(state));
}, job);
await page.reload({ waitUntil: "networkidle2" });
await shot(page, "intake-job-upload-closing-ship-1280.png", 1280);
await shot(page, "intake-job-upload-closing-ship-375.png", 375);

await page.evaluate((jobId) => {
  const state = JSON.parse(sessionStorage.getItem("portal-intake-v1"));
  state.fileRequests[0].status = "closed-job";
  state.fileRequests[0].closedAt = "Demo";
  sessionStorage.setItem("portal-intake-v1", JSON.stringify(state));
}, job);
await page.reload({ waitUntil: "networkidle2" });
await shot(page, "intake-job-upload-closed-job-1280.png", 1280);
await shot(page, "intake-job-upload-closed-job-375.png", 375);

await page.evaluate(() => {
  const state = JSON.parse(sessionStorage.getItem("portal-intake-v1"));
  state.fileRequests[0].status = "closed-shipping-expired";
  state.fileRequests[0].orderShippedAtMs = Date.now() - 31 * 86400000;
  sessionStorage.setItem("portal-intake-v1", JSON.stringify(state));
});
await page.reload({ waitUntil: "networkidle2" });
await shot(page, "intake-job-upload-closed-shipping-1280.png", 1280);

await page.evaluate(() => sessionStorage.removeItem("portal-intake-v1"));
await page.reload({ waitUntil: "networkidle2" });
const buttons = await page.$$("button.btn--secondary");
for (const btn of buttons) {
  const text = await page.evaluate((el) => el.textContent, btn);
  if (text?.includes("Request files")) {
    await btn.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 400));
await shot(page, "intake-request-files-dialog-1280.png", 1280);
await page.keyboard.press("Escape");

await page.evaluate(
  (jobId, state) => {
    state.fileRequests[0].token = "upl-demo-customer";
    sessionStorage.setItem("portal-intake-v1", JSON.stringify(state));
  },
  job,
  seedOpenRequest(job),
);
await page.goto(`${base}/upload/upl-demo-customer`, { waitUntil: "networkidle2" });
await shot(page, "intake-customer-upload-open-1280.png", 1280);
await shot(page, "intake-customer-upload-open-375.png", 375);

await page.evaluate(() => {
  const state = JSON.parse(sessionStorage.getItem("portal-intake-v1"));
  state.fileRequests[0].status = "closed-job";
  sessionStorage.setItem("portal-intake-v1", JSON.stringify(state));
});
await page.reload({ waitUntil: "networkidle2" });
await shot(page, "intake-customer-upload-closed-1280.png", 1280);
await shot(page, "intake-customer-upload-closed-375.png", 375);

await page.goto(`${base}/admin/intake`, { waitUntil: "networkidle2" });
await shot(page, "intake-admin-embed-1280.png", 1280);
await shot(page, "intake-admin-embed-375.png", 375);

await page.goto(`${base}/phone-entry`, { waitUntil: "networkidle2" });
await shot(page, "intake-phone-entry-1280.png", 1280);
await shot(page, "intake-phone-entry-375.png", 375);

await browser.close();
console.log("Intake screenshots saved to", out);
