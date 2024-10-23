import { Locator, Page } from '@playwright/test';

export default class AboutPage {
  readonly page: Page;
  readonly aboutParagraph: Locator;

  constructor(page: Page) {
    this.page = page;
    this.aboutParagraph = this.page.getByText("The VEDA Dashboard is one of several user interfaces in the VEDA project");
  }
}