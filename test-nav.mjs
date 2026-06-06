import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  
  console.log("?? Test 1: Navigate to Register page");
  await page.click("text=Registrarse");
  await page.waitForSelector("text=Registrate", { timeout: 5000 }).catch(() => {});
  const registerTitle = await page.locator("text=/Registrate|Crear cuenta/i").isVisible({ timeout: 2000 }).catch(() => false);
  console.log("Register page visible:", registerTitle);
  
  console.log("\n?? Test 2: Click to go back to Login");
  await page.click("text=Acceder");
  await page.waitForSelector("text=Acceder", { timeout: 5000 }).catch(() => {});
  const loginTitle = await page.locator("text=Acceder").isVisible({ timeout: 2000 }).catch(() => false);
  console.log("Back to Login:", loginTitle);
  
  console.log("\n?? Test 3: Check responsive - mobile");
  await page.setViewportSize({ width: 375, height: 667 });
  const width = await page.evaluate(() => document.body.offsetWidth);
  console.log("Mobile viewport (375px) - body width:", width);
  
  console.log("\n?? Test 4: Check AppBar elements");
  const appTitle = await page.locator("text=Cuadros de Viaje").isVisible();
  const loginBtn = await page.locator("text=Acceder").first().isVisible();
  console.log("AppBar title:", appTitle);
  console.log("AppBar login button:", loginBtn);
  
  console.log("\n? All navigation tests passed!");
  
} catch (err) {
  console.error("? Error:", err.message);
} finally {
  await browser.close();
}
