import { test, expect } from '../pages/basePage';

test('explore a dataset', async ({
  page,
  explorePage,
  consentBanner,
  datasetSelectorComponent
}) => {
  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal to be visible in trace
  page.on('pageerror', (exception) => {
    // eslint-disable-next-line no-console
    console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
    pageErrorCalled = true;
  });

  const mapboxResponsePromise = page.waitForResponse(
    /api\.mapbox.com\/v4\/mapbox\.mapbox-streets-v8/i
  );
  await page.goto('/exploration');
  await consentBanner.acceptButton.click();

  await datasetSelectorComponent.addFirstDataset();

  const mapboxResponse = await mapboxResponsePromise;
  expect(
    mapboxResponse.ok(),
    'mapbox request should be successful'
  ).toBeTruthy();

  await explorePage.closeFeatureTour();
  await expect(
    explorePage.presetSelector,
    'preset selector should be visible'
  ).toBeVisible();

  await expect(
    explorePage.mapboxCanvas,
    'mapbox canvas should be visible'
  ).toBeVisible();

  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
    false
  );
});
