import { Locator, Page } from '@playwright/test';

export default class ConsentBanner {
  readonly page: Page;
  readonly aboutParagraph: Locator;
  readonly consentBanner: Locator;
  readonly acceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentBanner  = this.page.locator('#cookie-consent');
    this.acceptButton = this.consentBanner.getByRole('button', {name: /accept cookies/i});
  }
}