import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { createMagicToken } from "../src/lib/portal/session.ts";

const key = "bloomingrock-portal-demo";
const out = "/opt/cursor/artifacts/screenshots";
const base = "http://127.0.0.1:3000/portal";

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

async function shot(page, name, width = 1280) {
  await page.setViewport({ width, height: width === 375 ? 900 : 900 });
  await page.screenshot({ path: `${out}/${name}`, fullPage: true });
}

const page = await browser.newPage();
await login(page, "maya@northridge.demo");

await page.goto(`${base}/jobs/warehouse-b-stair/sign-off`, { waitUntil: "networkidle2" });
await shot(page, "blo21-signoff-email-preview-1280.png");

await page.goto(`${base}/jobs/warehouse-b-stair`, { waitUntil: "networkidle2" });
await shot(page, "blo21-signoff-activity-log-1280.png");

await page.goto(`${base}/jobs/itar-mezz-guard`, { waitUntil: "networkidle2" });
await shot(page, "blo21-controlled-job-banner-1280.png");

await browser.close();
console.log("Saved BLO-21 screenshots to", out);
