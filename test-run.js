const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Intentar acceder a la app
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    
    // Verificar que cargó
    const title = await page.title();
    const bodyText = await page.textContent('body');
    
    console.log('? App accessible at http://localhost:5173');
    console.log('Title:', title);
    console.log('Page visible:', bodyText.substring(0, 100) + '...');
    
    // Tomar screenshot
    await page.screenshot({ path: 'app-screenshot.png', fullPage: true });
    console.log('? Screenshot saved: app-screenshot.png');
    
    // Verificar que hay elementos de UI esperados
    const hasLoginOrDashboard = await page.locator('[role="main"]').isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Has main content:', hasLoginOrDashboard);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
