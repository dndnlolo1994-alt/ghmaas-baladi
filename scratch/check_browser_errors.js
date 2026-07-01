const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  
  page.on('pageerror', err => {
    console.error('PAGE_ERROR:', err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE_ERROR:', msg.text());
    }
  });

  await page.goto('https://www.ghmass-baladi.com/admin');
  
  // Fill login
  await page.fill('#emailInput', 'contact@ghmass-baladi.com');
  await page.fill('#passwordInput', 'Ghmass2026$');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000); // wait for data to load and render
  
  // try clicking the menu tab
  const menuTab = await page.$('.nav-tab[data-target="tab-menu"]');
  if (menuTab) {
      await menuTab.click();
      console.log('Clicked menu tab');
  } else {
      console.log('Menu tab not found');
  }
  
  await page.waitForTimeout(2000);
  
  // check if menu items are rendered
  const itemsCount = await page.evaluate(() => document.querySelectorAll('.admin-item-row').length);
  console.log(`Rendered items count: ${itemsCount}`);
  
  await browser.close();
})();
