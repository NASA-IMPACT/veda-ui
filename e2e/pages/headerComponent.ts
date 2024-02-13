import { Locator, Page } from '@playwright/test';

export default class HeaderComponent {
  readonly page: Page;
  readonly header: Locator;
  readonly welcomeLink: Locator;
  readonly dataCatalogLink: Locator;
  readonly analysisLink: Locator;
  readonly dataInsightsLink: Locator;
  readonly aboutLink: Locator;
  readonly feedbackLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.getByRole('navigation');
    this.welcomeLink = this.header.getByRole('link', {name: /welcome/i});
    this.dataCatalogLink = this.header.getByRole('link', {name: / data catalog/i});
    this.analysisLink = this.header.getByRole('link', {name: /analysis/i});
    this.dataInsightsLink = this.header.getByRole('link', {name: /data insights/i});
    this.aboutLink = this.header.getByRole('link', {name: /about/i});
    this.feedbackLink = this.header.getByRole('link', {name: /feedback/i});
  }
}