import fs from 'fs';
import { test, expect } from '../pages/basePage';

const datasetIds = JSON.parse(fs.readFileSync('e2e/playwrightTestData.json', 'utf8')).datasetIds;

test.describe('explore dataset', () => {
 for (const dataset of datasetIds) {
  test(`${dataset} explore page functions`, async({
    page,
    explorePage,
  }) => {
    let pageErrorCalled = false;
  // Log all uncaught errors to the terminal to be visible in trace
    page.on('pageerror', exception => {
      console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
      pageErrorCalled = true;
    });

    //mosaic isn't hit on all datasets
    const collectionsResponsePromise = page.waitForResponse(response =>
      response.url().includes('collections') && response.status() === 200
    );

    await page.goto(`data-catalog/${dataset}/explore`);
    await expect(explorePage.layersHeading).toBeVisible();

    const mosaicResponse = await collectionsResponsePromise;
    expect(mosaicResponse.ok(), 'mapbox request should be successful').toBeTruthy();

    // scroll page to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);
  });
 }

});