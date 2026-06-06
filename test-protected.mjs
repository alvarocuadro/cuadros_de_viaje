import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  console.log("?? Test: Protected route redirect");
  
  // Intentar acceder a dashboard sin auth
  await page.goto("http://localhost:5173/dashboard", { waitUntil: "domcontentloaded" });
  
  // Verificar si redirecciona a login
  const currentURL = page.url();
  const isOnLogin = currentURL.includes("login");
  const loginVisible = await page.locator("text=Acceder").isVisible({ timeout: 2000 }).catch(() => false);
  
  console.log("Current URL:", currentURL);
  console.log("Redirected to login:", isOnLogin);
  console.log("Login form visible:", loginVisible);
  
  if (isOnLogin && loginVisible) {
    console.log("\n? PrivateRoute protection working!");
  }
  
} finally {
  await browser.close();
}
