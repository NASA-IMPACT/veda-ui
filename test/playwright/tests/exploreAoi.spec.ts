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
    // When I select the "Analyze an area" tool (Dropdown menu)
    const toolbar = page.getByTestId('preset-selector');
    // And choose one of the listed regions
    await toolbar.selectOption('Hawaii');

    // Then map should display the selected area as the AOI
    // const aoi = await page.$('selector-for-aoi'); // Adjust the selector as needed
    // expect(aoi).not.toBeNull();

    // // And the AOI should not be editable when clicking on it
    // await page.click('selector-for-aoi'); // Adjust the selector as needed
    // const isEditable = await page.$eval('selector-for-aoi', el => console.log(el)); // Adjust the selector as needed
    // expect(isEditable).toBe(false);

    // And the analysis message should display the size of the area
    const analysisMessage = await page
      .getByTestId('analysis-message')
      .textContent()

    expect(analysisMessage).toContain('An area of 17 K km2 is selected.');

    // And the 'Delete all areas' button should be shown
    const deleteButton = await page.$('text=Delete all areas');
    expect(deleteButton).not.toBeNull();

    // And the 'Run analysis' button should be shown
    const runButton = await page.$('text=Run analysis');
    expect(runButton).not.toBeNull();
  });
});
