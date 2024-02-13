import fs from 'fs';
import { test, expect } from '../pages/basePage';

const catalogs = JSON.parse(fs.readFileSync('e2e/playwrightTestData.json', 'utf8')).catalogs;

test.describe('catalog card routing', () => {
 for (const item of catalogs) {
  test(`${item} routes to dataset details page`, async({
    page,
    catalogPage,
    datasetPage,
  }) => {
    let pageErrorCalled = false;
  // Log all uncaught errors to the terminal to be visible in trace
    page.on('pageerror', exception => {
      console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
      pageErrorCalled = true;
    });

    await page.goto('/data-catalog');
    await expect(catalogPage.header, `catalog page should load`).toHaveText(/data catalog/i);

    const catalogCard = catalogPage.mainContent.getByRole('article').getByRole('heading', { level: 3, name: item, exact: true}).first();
    await catalogCard.scrollIntoViewIfNeeded();
    await catalogCard.click({force: true});

    await expect(datasetPage.header.filter({ hasText: item}), `${item} page should load`).toBeVisible();

    // scroll page to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);
  });
 }

});