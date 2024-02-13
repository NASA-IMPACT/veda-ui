import { Locator, Page } from '@playwright/test';

export default class AboutPage {
  readonly page: Page;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = this.page.getByRole('main');
  }
}