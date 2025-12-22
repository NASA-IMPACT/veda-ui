import { Locator, Page, test } from '@playwright/test';

export default class DatasetPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly header: Locator;
  readonly exploreDataButton: Locator;
  readonly analyzeDataButton: Locator;
  readonly taxonomyLinkSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = this.page.getByRole('main');
    this.header = this.mainContent.getByRole('heading', { level: 1 });
    this.exploreDataButton = this.page.getByRole('link', {
      name: /explore data/i
    });
    this.analyzeDataButton = this.page.getByRole('button', {
      name: /analyze data/i
    });
    this.taxonomyLinkSection = this.page.locator('section').filter({
      has: page.getByRole('heading', {
        name: /taxonomy/i,
        includeHidden: true
      })
    });
  }

  async getAllTaxonomyLinks() {
    return await test.step('get all links in taxonomy section', async () => {
      return this.taxonomyLinkSection.locator('dd').getByRole('link').all();
    });
  }
}
