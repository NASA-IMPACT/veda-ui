import fs from 'fs';
import { test, expect } from '../pages/basePage';

const catalogs = JSON.parse(fs.readFileSync('e2e/playwrightTestData.json', 'utf8')).catalogs;

test('load catalogs on /data-catalog route', async ({
  page,
  catalogPage,
 }) => {
  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal to be visible in trace
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
    pageErrorCalled = true;
  });

  await page.goto('/data-catalog');
  await expect(catalogPage.header, 'catalog page should load').toBeVisible();

  for (const item of catalogs) {
    const catalogCard = catalogPage.mainContent.getByRole('article').getByRole('heading', { level: 3, name: item, exact: true}).last();
    await catalogCard.scrollIntoViewIfNeeded();
    await expect(catalogCard, `${item} catalog card should load`).toBeVisible();
  }

  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);
});
