import { Locator, Page } from '@playwright/test';

export default class NotebookConnectModal {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = this.page.getByRole('heading', {
      name: /how to use this dataset/i
    });
  }
}
