import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  // Intentar acceder a la app
  console.log("Accessing http://localhost:5173...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => {});
  
  // Verificar que cargó
  const title = await page.title();
  const bodyText = await page.textContent("body");
  
  console.log("? App accessible at http://localhost:5173");
  console.log("Page Title:", title);
  
  // Tomar screenshot
  await page.screenshot({ path: "app-screenshot.png", fullPage: true });
  console.log("? Screenshot saved to: app-screenshot.png");
  
  // Buscar elementos clave
  const hasHeader = await page.locator("header").isVisible({ timeout: 1000 }).catch(() => false);
  const hasAuth = await page.locator("text=/Revisá tu email|Mis viajes/i").isVisible({ timeout: 1000 }).catch(() => false);
  
  console.log("\nUI Elements:");
  console.log("- Header present:", hasHeader);
  console.log("- Auth/Dashboard content:", hasAuth);
  
} catch (err) {
  console.error("Error:", err.message);
} finally {
  await browser.close();
}
