import fs from 'fs';
import { test, expect } from '../pages/basePage';

const stories = JSON.parse(fs.readFileSync('e2e/playwrightTestData.json', 'utf8')).stories;

test.describe('stories card routing', () => {
 for (const item of stories) {
  test(`${item} routes to dataset details page`, async({
    page,
    storyPage,
    datasetPage,
  }) => {
    let pageErrorCalled = false;
    // Log all uncaught errors to the terminal to be visible in trace
    page.on('pageerror', exception => {
      console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
      pageErrorCalled = true;
    });

    await page.goto('/stories');
    await expect(storyPage.header, `stories page should load`).toHaveText(/stories/i);

    const storyCard = storyPage.mainContent.getByRole('article').getByRole('heading', { level: 3, name: item, exact: true}).last();
    await storyCard.scrollIntoViewIfNeeded();
    await storyCard.click({force: true});
    await expect(datasetPage.header.filter({ hasText: item}), `${item} page should load`).toBeVisible();

    // scroll page to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);
  });
 }

});