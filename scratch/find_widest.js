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

  const widest = await page.evaluate(() => {
    let maxW = 0;
    let culprit = '';
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.offsetWidth > 370 && el.tagName !== 'BODY' && el.tagName !== 'HTML' && el.tagName !== 'MAIN') {
        const style = window.getComputedStyle(el);
        // Only care about elements that are actually pushing the layout
        console.log(`<${el.tagName} class="${el.className}"> width: ${el.offsetWidth}, scrollWidth: ${el.scrollWidth}`);
      }
    }
    
    // Also, let's just return a tree of elements > 390px
    const result = [];
    for (const el of all) {
      if (el.offsetWidth > 390 && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
         result.push({
           tag: el.tagName,
           className: el.className,
           id: el.id,
           offsetWidth: el.offsetWidth,
           minWidth: window.getComputedStyle(el).minWidth,
           width: window.getComputedStyle(el).width,
           text: el.textContent.substring(0, 30).trim()
         });
      }
    }
    return result;
  });

  console.log(JSON.stringify(widest, null, 2));
  await browser.close();
})();
