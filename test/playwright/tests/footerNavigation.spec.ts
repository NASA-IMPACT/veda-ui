import { test, expect } from '../pages/basePage';

test.describe('ensure links in footer route to expected page', () => {
  test('learn more link', async ({
    page,
    consentBanner,
    footerComponent,
    aboutPage
  }) => {
    await page.goto('/');
    await consentBanner.acceptButton.click();
    await expect(footerComponent.footer).toBeVisible();
    await footerComponent.clickLink('learn');
    await expect(aboutPage.aboutParagraph).toBeVisible();
    await expect(page).toHaveURL(/\/about/i);
  });

  test('give feedback link', async ({
    page,
    consentBanner,
    footerComponent,
    contactModal
  }) => {
    await page.goto('/');
    await consentBanner.acceptButton.click();

    await expect(
      footerComponent.footer,
      'footer should be visible'
    ).toBeVisible();
    await footerComponent.clickLink('feedback');
    await expect(contactModal.header).toBeVisible();
  });
});
