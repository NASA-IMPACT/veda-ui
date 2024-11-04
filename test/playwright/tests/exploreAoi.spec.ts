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
      // How to check if the pre-defined AOI is created? Can we access the canvas, or methods of mbDraw?

      await test.step('And the AOI should not be editable when clicking on it', async () => {
        // How to check that the drawing mode did not change for the AOI? 
        // Can we access the canvas, or methods of mbDraw?
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

  test('User draws AOI when pre-defined AOI exists', async ({ page }) => {
    await test.step('Given that there is a pre-defined AOI on the map', async () => {
      const toolbar = page.getByTestId('preset-selector');
      await toolbar.selectOption('Hawaii');
    });

    await test.step('When I click on a pen tool to draw custom AOI', async () => {
      await page.getByRole('button', { name: 'Draw AOI' }).click();
    });

    await test.step('Then the AOI from pre-defined AOIs should be deleted', async () => {
      // How to check if the pre-defined AOI is deleted? Can we access the canvas, or methods of mbDraw?
    });

    await test.step('And the pre-defined selector should be reset and display the placeholder text', async () => {
      const toolbar = page.getByTestId('preset-selector');
      expect(toolbar).toHaveValue('Analyze an area');
    });
  });
});
