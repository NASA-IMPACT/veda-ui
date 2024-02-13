import { Locator, Page } from '@playwright/test';

export default class FooterComponent {
  readonly page: Page;
  readonly footer: Locator;
  readonly partners: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = this.page.locator('footer');
    this.partners = this.footer.locator('div');
  }
}