import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  page.on('response', async response => {
    if (response.url().includes('/trips') && response.request().method() === 'POST') {
      console.log('POST /trips response status:', response.status());
      try {
        console.log('POST /trips response body:', await response.json());
      } catch (e) {
        console.log('POST /trips response body text:', await response.text());
      }
    }
  });

  page.on('request', request => {
    if (request.url().includes('/trips') && request.method() === 'POST') {
      console.log('POST /trips PAYLOAD:', request.postData());
    }
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:4200/login');
  
  await page.fill('input[formControlName="email"]', 'admin@test.com');
  await page.fill('input[formControlName="password"]', 'password123');
  await page.click('button[type="submit"]');

  console.log('Waiting for admin dashboard...');
  await page.waitForURL('http://localhost:4200/admin');
  
  console.log('Navigating to admin trips...');
  await page.goto('http://localhost:4200/admin/trips');
  await page.waitForSelector('button:has-text("Create Trip")');
  
  console.log('Opening dialog...');
  await page.click('button:has-text("Create Trip")');
  await page.waitForSelector('mat-dialog-container');

  console.log('Filling form...');
  await page.fill('input[formControlName="vehicleNumber"]', 'MH-12-AB-1234');
  await page.fill('input[formControlName="origin"]', 'Mumbai');
  await page.fill('input[formControlName="destination"]', 'Pune');
  
  console.log('Filling datetime-local...');
  await page.fill('input[formControlName="scheduledStart"]', '2026-07-05T10:30');

  console.log('Selecting driver...');
  await page.click('mat-select[formControlName="driverId"]');
  await page.click('mat-option:has-text("Driver User")');

  console.log('Clicking Save...');
  await page.click('button:has-text("Save")');

  await page.waitForTimeout(3000);
  console.log('Test finished.');
  
  await browser.close();
})();
