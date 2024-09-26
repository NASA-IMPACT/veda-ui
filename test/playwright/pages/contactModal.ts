import { Locator, Page } from '@playwright/test';

export default class ContactModal {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.getByRole("heading", {level: 1, name: /contact us/i });
  }
}