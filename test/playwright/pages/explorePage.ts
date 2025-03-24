import { Locator, Page, test } from '@playwright/test';

export default class ExplorePage {
  readonly page: Page;
  readonly layersHeading: Locator;
  readonly mapboxCanvas: Locator;
  readonly firstDatasetItem: Locator;
  readonly closeFeatureTourButton: Locator;
  readonly presetSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.layersHeading = this.page.getByRole('heading', { name: 'Layers' });
    this.mapboxCanvas = this.page.getByLabel('Map', { exact: true });
    this.firstDatasetItem = this.page.getByRole('article');
    this.closeFeatureTourButton = this.page.getByRole('button', {
      name: 'Close feature tour'
    });
    this.presetSelector = this.page.getByTestId('preset-selector');
  }

  async closeFeatureTour() {
    await test.step('close feature tour', async () => {
      await this.closeFeatureTourButton.click();
    });
  }
}
