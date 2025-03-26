import { test, expect } from '../pages/basePage';

const stories = JSON.parse(
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('fs').readFileSync('test/playwright/playwrightTestData.json', 'utf8')
)['stories'];

test.describe('stories card routing', () => {
  for (const item of stories) {
    if (item !== 'External Link Test' && item !== 'Internal Link Test') {
      test(`${item} routes from stories to details page`, async ({
        page,
        storiesPage,
        datasetPage
      }) => {
        let pageErrorCalled = false;
        // Log all uncaught errors to the terminal
        page.on('pageerror', (exception) => {
          // eslint-disable-next-line no-console
          console.log(`Uncaught exception: "${exception}"`);
          pageErrorCalled = true;
        });

        await page.goto('/stories');
        await expect(
          storiesPage.header,
          `stories page should load`
        ).toBeVisible();

        await test.step(`click on ${item} article card`, async () => {
          const storyCard = storiesPage.mainContent
            .getByRole('article')
            .getByRole('heading', { level: 3, name: item, exact: true })
            .last();
          await storyCard.scrollIntoViewIfNeeded();
          await storyCard.click({ force: true });
        });
        await expect(
          datasetPage.header.filter({ hasText: item }),
          `${item} page should load`
        ).toBeVisible();
        expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
          false
        );
      });
    }
  }
});

test('external link on Stories page opens in new tab', async ({
  page,
  storiesPage
}) => {
  await page.goto('/stories');
  await expect(storiesPage.header, `stories page should load`).toBeVisible();

  await test.step('click on External Link Test card', async () => {
    const storyCard = storiesPage.mainContent
      .getByRole('article')
      .getByRole('heading', {
        level: 3,
        name: 'External Link Test',
        exact: true
      })
      .last();
    await storyCard.scrollIntoViewIfNeeded();
    await storyCard.click({ force: true });
  });

  const newTabPromise = page.waitForEvent('popup');
  const newTab = await newTabPromise;
  await expect(newTab).toHaveURL('https://developmentseed.org/');
});

test('internal link on Stories page opens in same tab', async ({
  page,
  consentBanner,
  storiesPage
}) => {
  await page.goto('/stories');
  await consentBanner.acceptButton.click();
  await expect(storiesPage.header, `stories page should load`).toBeVisible();

  await test.step('click on Internal Link Test card', async () => {
    const storyCard = storiesPage.mainContent
      .getByRole('article')
      .getByRole('heading', {
        level: 3,
        name: 'Internal Link Test',
        exact: true
      })
      .last();
    await storyCard.scrollIntoViewIfNeeded();
    await storyCard.click({ force: true });
  });
  await expect(page).toHaveURL(/\/data-catalog/i);
});
