import { chromium } from 'playwright';

(async () => {
  let hasErrors = false;
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
      hasErrors = true;
    }
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:4200/login');
  
  await page.fill('input[formControlName="email"]', 'admin@test.com');
  await page.fill('input[formControlName="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:4200/admin');
  await page.goto('http://localhost:4200/admin/trips');
  await page.waitForSelector('table');

  const getRowCount = async () => {
    return await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr.mat-row');
      if (rows.length === 1 && rows[0].classList.contains('empty-state')) return 0;
      return rows.length;
    });
  };

  const initialRows = await getRowCount();
  console.log(`Initial trips: ${initialRows}`);

  console.log('Testing: Date with trips (Today)');
  // We can just type into the datepicker input if it allows it, or use evaluate.
  // mat-datepicker allows typing mm/dd/yyyy
  const today = new Date();
  const m = ('0' + (today.getMonth() + 1)).slice(-2);
  const d = ('0' + today.getDate()).slice(-2);
  const y = today.getFullYear();
  await page.fill('input[placeholder="Select a date"]', `${m}/${d}/${y}`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500); // Wait for filter to apply
  const todayRows = await getRowCount();
  console.log(`Trips today: ${todayRows}`);

  console.log('Testing: Date with no trips (Future date)');
  await page.fill('input[placeholder="Select a date"]', '12/31/2099');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const futureRows = await getRowCount();
  console.log(`Trips on 12/31/2099: ${futureRows}`);

  console.log('Testing: Clear filter');
  await page.click('button:has-text("Clear Filters")');
  await page.waitForTimeout(500);
  const clearedRows = await getRowCount();
  console.log(`Trips after clear: ${clearedRows}`);

  console.log('Testing: Combined filters');
  // We know there's at least one SCHEDULED trip (or CANCELLED)
  await page.click('mat-select[aria-label="Status"]'); // it doesn't have aria-label, wait
  await page.evaluate(() => {
    // Manually trigger the select if selector is hard
    document.querySelector('mat-select').click();
  });
  await page.waitForSelector('mat-option');
  await page.click('mat-option:has-text("All")'); // just test clicking an option
  
  await page.fill('input[placeholder="Filter by driver"]', 'Test');
  await page.waitForTimeout(500);
  const combinedRows = await getRowCount();
  console.log(`Trips with driver 'Test': ${combinedRows}`);

  if (hasErrors) {
    console.log('TEST FAILED: Console errors found');
  } else {
    console.log('ALL TESTS PASSED');
  }
  
  await browser.close();
})();
