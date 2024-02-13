import { Locator, Page } from '@playwright/test';

export default class HomePage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly headingContainer: Locator;


  constructor(page: Page) {
    this.page = page;
    this.mainContent = this.page.getByRole('main');
    this.headingContainer = this.mainContent.locator('div').filter({ hasText: 'U.S. Greenhouse Gas CenterUniting Data and Technology to Empower Tomorrow\'s' }).nth(2)
  }
}