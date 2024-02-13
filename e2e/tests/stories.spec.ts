import fs from 'fs';
import { test, expect } from '../pages/basePage';

const stories = JSON.parse(fs.readFileSync('e2e/playwrightTestData.json', 'utf8')).stories;

test('load stories on /stories route', async ({
  page,
  storyPage,
 }) => {

  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
    pageErrorCalled = true;
  });

  await page.goto('/stories');
  await expect(storyPage.header, `data stories page should load`).toHaveText(/stories/i);

  for (const item of stories) {
    const storiesCard = storyPage.mainContent.getByRole('article').getByRole('heading', { level: 3, name: item, exact: true}).first();
    await storiesCard.scrollIntoViewIfNeeded();
    await expect(storiesCard, `${item} story card should load`).toBeVisible();
  }

  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);

});