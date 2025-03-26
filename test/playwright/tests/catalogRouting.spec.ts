import fs from 'fs';
import { test, expect } from '../pages/basePage';

const catalogs = JSON.parse(
  fs.readFileSync('test/playwright/playwrightTestData.json', 'utf8')
)['catalogs'];

test.describe('catalog card routing', () => {
  for (const item of catalogs) {
    test(`${item} routes from catalog to details page`, async ({
      page,
      catalogPage,
      consentBanner,
      datasetPage
    }) => {
      let pageErrorCalled = false;
      // Log all uncaught errors to the terminal
      page.on('pageerror', (exception) => {
        // eslint-disable-next-line no-console
        console.log(`Uncaught exception: "${exception}"`);
        pageErrorCalled = true;
      });

      await page.goto('/data-catalog');
      await consentBanner.acceptButton.click();
      await expect(
        catalogPage.header,
        `catalog page should load`
      ).toBeVisible();
      await catalogPage.clickCatalogCard(item);

      await expect(
        datasetPage.header.filter({ hasText: item }),
        `${item} page should load`
      ).toBeVisible();

      // scroll page to bottom
      await test.step('scroll to bottom of page', async () => {
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
      });

      expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
        false
      );
    });
  }
});
