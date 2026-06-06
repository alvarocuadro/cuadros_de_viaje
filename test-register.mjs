import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto("http://localhost:5173/register", { waitUntil: "domcontentloaded" });
  
  await page.screenshot({ path: "register-page.png", fullPage: true });
  console.log("? Register page screenshot saved");
  
} finally {
  await browser.close();
}
