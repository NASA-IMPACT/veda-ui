import { Locator, Page } from '@playwright/test';

export default class DatasetPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly header: Locator;
  readonly exploreDataButton: Locator;
  readonly analyzeDataButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.mainContent = this.page.getByRole('main');
    this.header = this.mainContent.getByRole('heading', { level: 1 })
    this.exploreDataButton = this.page.getByRole('link', {name: /explore data/i} );
    this.analyzeDataButton = this.page.getByRole('button', {name: /analyze data/i} );
  }
}