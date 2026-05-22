const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.youtube.com/results?search_query=horseback+archery', { waitUntil: 'domcontentloaded' });

  await page.waitForLoadState('networkidle');
  console.log('Search complete:', page.url());

  // Keep browser open for 30 seconds so user can see results
  await page.waitForTimeout(30000);
  await browser.close();
})();
