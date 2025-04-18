import { test, expect } from '../pages/basePage';

const catalogs = JSON.parse(
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('fs').readFileSync('test/playwright/playwrightTestData.json', 'utf8')
)['catalogs'];

test('catalogs displayed on /data-catalog route', async ({
  page,
  catalogPage,
  consentBanner
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
  await expect(catalogPage.header, `catalog page should load`).toHaveText(
    /data catalog/i
  );

  for (const item of catalogs) {
    await test.step(`locate ${item} catalog card`, async () => {
      const catalogCard = catalogPage.mainContent
        .getByTestId('CardGroup')
        .getByRole('heading', { level: 2, name: item, exact: true })
        .last();
      await catalogCard.scrollIntoViewIfNeeded();
      await expect(
        catalogCard,
        `${item} catalog card should load`
      ).toBeVisible();
    });
  }

  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
    false
  );
});
