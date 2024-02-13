import { Locator, Page } from '@playwright/test';

export default class AnalysisResultsPage {
  readonly page: Page;
  readonly analysisCards: Locator;


  constructor(page: Page) {
    this.page = page;
    this.analysisCards = this.page.getByTestId('analysisCards');
  }

}