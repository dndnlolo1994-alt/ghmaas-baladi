const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  
  await page.goto('file:///C:/Users/m4ah4/Desktop/غماس/admin.html');
  
  // Fill login
  await page.fill('#emailInput', 'contact@ghmass-baladi.com');
  await page.fill('#passwordInput', 'Ghmass2026$');
  await page.click('button[type="submit"]');
  
  // Wait for admin dashboard to load
  await page.waitForSelector('.admin-layout', { state: 'visible' });
  await page.waitForTimeout(2000); // Wait a bit for animations
  
  await page.screenshot({ path: 'C:/Users/m4ah4/Desktop/غماس/scratch/admin-dashboard-mobile.png', fullPage: false });
  
  await browser.close();
})();
