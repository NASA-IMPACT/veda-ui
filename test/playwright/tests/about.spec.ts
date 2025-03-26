import { test, expect } from '../pages/basePage';

test('about page should have no javascript errors', async ({
  page,
  aboutPage,
  consentBanner
}) => {
  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal
  page.on('pageerror', (exception) => {
    // eslint-disable-next-line no-console
    console.warn(`Uncaught exception: "${exception}"`);
    pageErrorCalled = true;
  });

  await page.goto('/about');
  await consentBanner.acceptButton.click();
  await expect(
    aboutPage.aboutParagraph,
    `learn page should load`
  ).toBeVisible();

  // scroll page to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
    false
  );
});
