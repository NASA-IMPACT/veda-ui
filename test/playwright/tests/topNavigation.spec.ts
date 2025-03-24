import { test, expect } from '../pages/basePage';

test.describe('ensure links in top navigation route to expected page', () => {
  test('link', async ({ page, consentBanner, headerComponent }) => {
    await page.goto('/');
    await consentBanner.acceptButton.click();
    await expect(
      headerComponent.navigation,
      'header should load'
    ).toBeVisible();
    await headerComponent.clickLink('test');
    await expect(
      headerComponent.testDropdownLink,
      'dropdown link should be visible'
    ).toBeVisible();
    await headerComponent.testDropdownLink.click();
    await expect(page, 'should route to /stories').toHaveURL(/\/stories/i);
  });

  test('data catalog link', async ({
    page,
    consentBanner,
    headerComponent,
    catalogPage
  }) => {
    await page.goto('/');
    await expect(
      headerComponent.navigation,
      'header should load'
    ).toBeVisible();
    await consentBanner.acceptButton.click();
    await headerComponent.clickLink('dataCatalog');
    await expect(
      catalogPage.header,
      'catalog page header should load'
    ).toBeVisible();
    await expect(page, 'should route to /data-catalog').toHaveURL(
      /\/data-catalog/i
    );
  });

  test('exploration link', async ({
    page,
    consentBanner,
    headerComponent,
    datasetSelectorComponent
  }) => {
    await page.goto('/');
    await expect(
      headerComponent.navigation,
      'header should load'
    ).toBeVisible();
    await consentBanner.acceptButton.click();
    await headerComponent.clickLink('exploration');
    await expect(
      datasetSelectorComponent.header,
      'data selector header should load'
    ).toBeVisible();
    await expect(page, 'should route to /exploration').toHaveURL(
      /\/exploration/i
    );
  });

  test('stories link', async ({
    page,
    consentBanner,
    headerComponent,
    storiesPage
  }) => {
    await page.goto('/');
    await expect(
      headerComponent.navigation,
      'header should load'
    ).toBeVisible();
    await consentBanner.acceptButton.click();
    await headerComponent.clickLink('stories');
    await expect(
      storiesPage.header,
      'stories page header should load'
    ).toBeVisible();
    await expect(page, 'should route to /stories').toHaveURL(/\/stories/i);
  });

  test('about link', async ({
    page,
    consentBanner,
    headerComponent,
    aboutPage
  }) => {
    await page.goto('/');
    await expect(
      headerComponent.navigation,
      'header should load'
    ).toBeVisible();
    await consentBanner.acceptButton.click();
    await headerComponent.clickLink('about');
    await expect(
      aboutPage.aboutParagraph,
      'about paragraph should be visible'
    ).toBeVisible();
    await expect(page, 'should route to about page').toHaveURL(/\/about/i);
  });

  test('contact us button', async ({
    page,
    consentBanner,
    headerComponent,
    contactModal
  }) => {
    await page.goto('/');
    await expect(
      headerComponent.navigation,
      'header should load'
    ).toBeVisible();
    await consentBanner.acceptButton.click();
    await headerComponent.clickLink('contact');
    await expect(
      contactModal.header,
      'contact modal header should be visible'
    ).toBeVisible();
    await expect(
      page.locator('iframe'),
      'an iframe should be visible'
    ).toBeVisible();
  });
});
