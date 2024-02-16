import { test, expect } from '../pages/basePage';

test('generate analysis with polygon', async ({
  page,
  analysisPage,
  analysisResultsPage,
 }) => {
  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal to be visible in trace
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
    pageErrorCalled = true;
  });

  const mapboxResponsePromise = page.waitForResponse(/api\.mapbox.com\/v4\/mapbox\.mapbox-streets-v8/i);
  await page.goto('/analysis');
  await expect(analysisPage.header, `analysis page should load`).toBeVisible();
  const mapboxResponse = await mapboxResponsePromise;
  expect(mapboxResponse.ok(), 'mapbox request should be successful').toBeTruthy();
  await expect(analysisPage.mapboxCanvas, 'mapbox canvas should be visible').toBeVisible();
  
  const box = await analysisPage.mapboxCanvas.boundingBox();

  // using Non-null Assertion because we know the mapbox is visible, therefore box is not null
  const firstCorner = [box!.width * 0.2, box!.height * 0.2];
  const secondCorner = [box!.width * 0.8, box!.height * 0.2];
  const thirdCorner = [box!.width * 0.8, box!.height * 0.8];
  const fourthCorner = [box!.width * 0.2, box!.height * 0.8];


  await analysisPage.mapboxCanvas.click();

  await analysisPage.drawPolygon([firstCorner, secondCorner, thirdCorner, fourthCorner])

  await analysisPage.clickDatasetOption(1);

  const searchResponsePromise = page.waitForResponse(/\/search/i);
  await analysisPage.generateAnalysisButton.click({force: true });


  const searchResponse = await searchResponsePromise;
  expect(searchResponse.ok(), 'request to GET /search should be successful').toBeTruthy();

  await expect(analysisResultsPage.analysisCards.first(), 'at least one analysis results is visible' ).toBeVisible();

  // scroll page to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);

});


test('generate analysis with region select', async ({
  page,
  analysisPage,
  analysisResultsPage,
 }) => {
  let pageErrorCalled = false;
  // Log all uncaught errors to the terminal to be visible in trace
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${JSON.stringify(exception)}"`);
    pageErrorCalled = true;
  });

  const mapboxResponsePromise = page.waitForResponse(/api\.mapbox.com\/v4\/mapbox\.mapbox-streets-v8/i);
  await page.goto('/analysis');
  await expect(analysisPage.header, `analysis page should load`).toBeVisible();
  const mapboxResponse = await mapboxResponsePromise;
  expect(mapboxResponse.ok(), 'mapbox request should be successful').toBeTruthy();
  await expect(analysisPage.mapboxCanvas, 'mapbox canvas should be visible').toBeVisible();
  
  await analysisPage.moreOptionsButton.click();
  await analysisPage.northAmericaOption.click();

  await analysisPage.clickDatasetOption(1);

  const searchResponsePromise = page.waitForResponse(/\/search/i);
  await analysisPage.generateAnalysisButton.click({force: true });


  const searchResponse = await searchResponsePromise;
  expect(searchResponse.ok(), 'request to GET /search should be successful').toBeTruthy();

  await expect(analysisResultsPage.analysisCards.first(), 'at least one analysis results is visible' ).toBeVisible();

  expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(false);

});