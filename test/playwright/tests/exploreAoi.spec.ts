import { test, expect } from '../pages/basePage';

test.describe('Area of Interest (AOI) Analysis', () => {
  test.beforeEach(
    async ({ page, explorePage, consentBanner, datasetSelectorComponent }) => {
      let pageErrorCalled = false;
      // Log all uncaught errors to the terminal to be visible in trace
      page.on('pageerror', (exception) => {
        console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
        pageErrorCalled = true;
      });

      const mapboxResponsePromise = page.waitForResponse(
        /api\.mapbox.com\/v4\/mapbox\.mapbox-streets-v8/i
      );

      // Given that I am on the map view (explore page)
      await page.goto('/exploration');
      await consentBanner.acceptButton.click();
      await datasetSelectorComponent.addFirstDataset();
      await explorePage.closeFeatureTour();
    }
  );

  test('User selects a pre-defined AOI', async ({ page }) => {
    await test.step('When I select the "Analyze an area" tool (Dropdown menu)', async () => {
      const toolbar = page.getByTestId('preset-selector');

      await test.step('And choose one of the listed regions', async () => {
        toolbar.selectOption('Hawaii');
      });
    });

    await test.step('Then the map should display the selected area as the AOI', async () => {
      // const aoi = await page.$('selector-for-aoi'); // Adjust the selector as needed
      // expect(aoi).not.toBeNull();

      await test.step('And the AOI should not be editable when clicking on it', async () => {
        // await page.click('selector-for-aoi'); // Adjust the selector as needed
        // const isEditable = await page.$eval('selector-for-aoi', el => console.log(el)); // Adjust the selector as needed
        // expect(isEditable).toBe(false);
      });
    });

    await expect(
      page.getByTestId('analysis-message'),
      'And the analysis message should display the size of the area'
    ).toHaveText(/An area of 17 K km2/i);

    await expect(
      page.getByRole('button', { name: 'Delete all areas' }),
      'And the "Delete all areas" button should be shown'
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Run analysis' }),
      'And the "Run analysis" button should be shown'
    ).toBeVisible();
  });
});
