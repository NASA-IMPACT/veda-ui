import { test, expect } from '../pages/basePage';

const stories = JSON.parse(
  require('fs').readFileSync('test/playwright/playwrightTestData.json', 'utf8')
)['stories'];

test('load stories on /stories route', async ({
  page,
  consentBanner,
  storiesPage
}) => {
  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal
  page.on('pageerror', (exception) => {
    console.log(`Uncaught exception: "${exception}"`);
    pageErrorCalled = true;
  });

  await page.goto('/stories');
  await consentBanner.acceptButton.click();
  await expect(
    storiesPage.header,
    `data stories page should load`
  ).toBeVisible();

  for (const item of stories) {
    await test.step(`look for article with heading ${item}`, async () => {
      const storiesCard = storiesPage.mainContent
        .getByRole('article')
        .getByRole('heading', { level: 3, name: item, exact: true })
        .first();
      await storiesCard.scrollIntoViewIfNeeded();
      await expect(storiesCard, `${item} story card should load`).toBeVisible();
    });
  }

  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
    false
  );
});
