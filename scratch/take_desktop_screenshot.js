const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  
  await page.goto('file:///C:/Users/m4ah4/Desktop/غماس/admin.html');
  
  // Fill login
  await page.fill('#emailInput', 'contact@ghmass-baladi.com');
  await page.fill('#passwordInput', 'Ghmass2026$');
  await page.click('button[type="submit"]');
  
  // Wait a bit
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'C:/Users/m4ah4/Desktop/غماس/scratch/admin-dashboard-desktop.png', fullPage: false });
  
  await browser.close();
})();
