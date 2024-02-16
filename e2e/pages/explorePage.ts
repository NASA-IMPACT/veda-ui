import { Locator, Page } from '@playwright/test';

export default class ExplorePage {
  readonly page: Page;
  readonly layersHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.layersHeading = this.page.getByRole('heading', { name: 'Layers' });
  }
}