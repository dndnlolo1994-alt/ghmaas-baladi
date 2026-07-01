const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  
  await page.goto('https://www.ghmass-baladi.com/admin');
  await page.fill('#emailInput', 'contact@ghmass-baladi.com');
  await page.fill('#passwordInput', 'Ghmass2026$');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.admin-layout', { state: 'visible' });
  await page.waitForTimeout(2000);

  const widths = await page.evaluate(() => {
    const getInfo = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className,
        offsetWidth: el.offsetWidth,
        scrollWidth: el.scrollWidth,
        rectWidth: rect.width,
        rectLeft: rect.left,
        rectRight: rect.right,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        width: style.width
      };
    };
    return {
      html: getInfo('html'),
      body: getInfo('body'),
      adminShell: getInfo('.admin-shell'),
      adminLayout: getInfo('.admin-layout'),
      sidebar: getInfo('.admin-sidebar'),
      nav: getInfo('.sidebar-nav'),
      content: getInfo('.admin-content'),
      header: getInfo('.content-header'),
      panel: getInfo('.panel-card'),
      grid: getInfo('.admin-grid')
    };
  });

  console.log(JSON.stringify(widths, null, 2));
  await browser.close();
})();
