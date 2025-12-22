import { test, expect } from '../pages/basePage';

test.describe('Widgets', () => {
  let pageErrorCalled = false;

  test.beforeEach(async ({ page, consentBanner }) => {
    // Log all uncaught errors to the terminal
    page.on('pageerror', (exception) => {
      // eslint-disable-next-line no-console
      console.warn(`Uncaught exception: "${exception}"`);
      pageErrorCalled = true;
    });

    // Navigate to the test page rendering the widget component
    await page.goto('/sandbox/widgets');
    await consentBanner.acceptButton.click();
  });

  test('should open and close the Fullpage Modal widget', async ({ page }) => {
    const widgetContainer = page
      .locator('[data-testid="widget-container"]')
      .filter({ hasText: 'Fullpage Modal' });

    await expect(widgetContainer).toBeVisible();

    const widgetHeader = widgetContainer.locator(
      '[data-testid="widget-header"]'
    );
    await expect(widgetHeader).toBeVisible();

    const toggleButton = widgetContainer.locator(
      '[data-testid="widget-toggle"]'
    );
    await expect(toggleButton).toBeVisible();
    const widgetContent = widgetContainer.locator(
      '[data-testid="widget-content"]'
    );

    const fullContent = page.locator('[data-testid="full-content"]');

    await expect(widgetContent).toBeVisible();
    await expect(fullContent).toBeHidden();

    await toggleButton.click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(500); // Wait for animation to complete

    await expect(widgetContent).toBeHidden();
    await expect(fullContent).toBeVisible();

    await widgetContainer.locator('[data-testid="widget-toggle"]').click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(500); // Wait for animation to complete

    await expect(widgetContent).toBeVisible();
    await expect(fullContent).toBeHidden();

    // scroll page to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(pageErrorCalled, 'no javascript exceptions thrown on page').toBe(
      false
    );
  });

  test('should render the button with or without text, depending on widget width', async ({
    page
  }) => {
    const bigContainer = page
      .locator('[data-testid="widget-container"]')
      .filter({ hasText: 'Widget with Map' });
    const buttonWithText = bigContainer.locator(
      '[data-testid="widget-toggle"]'
    );
    await expect(buttonWithText).toBeVisible();
    await expect(buttonWithText).toHaveText('Enter fullscreen');

    const smallContainer = page
      .locator('[data-testid="widget-container"]')
      .filter({ hasText: 'Small Widget' });
    const buttonWithIconOnly = smallContainer.locator(
      '[data-testid="widget-toggle"]'
    );
    await expect(buttonWithIconOnly).toBeVisible();
    await expect(buttonWithIconOnly).not.toHaveText('Enter fullscreen');
  });
});
