import { Locator, Page, test } from '@playwright/test';

export default class CatalogPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly header: Locator;
  readonly accessDataButton: Locator;
  readonly exploreDataButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = this.page.getByRole('main');
    this.header = this.mainContent.getByRole('heading', {
      level: 1,
      name: /data catalog/i
    });
    this.accessDataButton = this.page.getByRole('button', {
      name: /access data/i
    });
    this.exploreDataButton = this.page.getByRole('button', {
      name: /explore data/i
    });
  }

  async clickCatalogCard(item: string) {
    await test.step(`click on catalog card for ${item}`, async () => {
      const catalogCard = this.mainContent
        .getByRole('article')
        .getByRole('heading', { level: 3, name: item, exact: true })
        .first();
      await catalogCard.scrollIntoViewIfNeeded();
      // eslint-disable-next-line playwright/no-force-option
      await catalogCard.click({ force: true });
    });
  }
}
