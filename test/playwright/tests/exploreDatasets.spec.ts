import fs from 'fs';
import { test, expect } from '../pages/basePage';

const datasetIds = JSON.parse(fs.readFileSync('test/playwright/playwrightTestData.json', 'utf8')).datasetIds;
const disabledDatasets = JSON.parse(fs.readFileSync('test/playwright/playwrightTestData.json', 'utf8')).disabledDatasets;

test.describe('explore dataset', () => {
  for (const dataset of datasetIds) {
    test(`${dataset} explore page functions`, async({
      page,
      consentBanner,
      datasetSelectorComponent,
      explorePage,
    }) => {
      let pageErrorCalled = false;
      // Log all uncaught errors to the terminal to be visible in trace
      page.on('pageerror', exception => {
        console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
        pageErrorCalled = true;
      });

      await page.goto(`/exploration?search=${dataset}&datasets=%5B%5D`);
      await consentBanner.acceptButton.click();


      if(disabledDatasets.includes(dataset)){
        await expect(datasetSelectorComponent.noDatasetMessage, 'dataset set to disabled').toBeVisible();
      } else {
        const collectionsResponsePromise = test.step('wait for collect api response', () => {
           return page.waitForResponse(response =>
            response.url().includes('collect') && response.status() === 200
          );
        })
        
        const datasetName = await datasetSelectorComponent.article.first().getByRole('heading', {level: 3}).innerText()
        await datasetSelectorComponent.addFirstDataset()

        const mosaicResponse = await collectionsResponsePromise;
        expect(mosaicResponse.ok(), 'mapbox request should be successful').toBeTruthy();

        await explorePage.closeFeatureTour();
        await expect(explorePage.firstDatasetItem.getByRole('heading', {name: datasetName}).first(), `article with name ${dataset} should be visible`).toBeVisible();
        // scroll page to bottom
        await test.step('scroll to bottom of the page', async() => {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        })
        expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);
      }
    })
  }
});