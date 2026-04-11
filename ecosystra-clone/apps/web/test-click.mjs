import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:3045', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('.column-header'));
    const ownerHeader = headers.find(h => h.textContent.includes('Owner'));
    if (ownerHeader) {
      const btn = ownerHeader.querySelector('.column-options-btn');
      if (btn) btn.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: '/Users/izzadev/.gemini/antigravity/brain/1fb9879b-697e-484b-bc30-4ad6e3184f7f/test_click_owner_menu.png' });
  console.log('Saved screenshot to: /Users/izzadev/.gemini/antigravity/brain/1fb9879b-697e-484b-bc30-4ad6e3184f7f/test_click_owner_menu.png');
  
  await browser.close();
})();
