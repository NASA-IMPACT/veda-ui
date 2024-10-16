/* eslint-disable playwright/no-conditional-in-test */
import { Locator, Page, test } from '@playwright/test';

type FooterLinkName = "learn" | "feedback"

export default class FooterComponent {
  readonly page: Page;
  readonly footer: Locator;
  readonly learnMoreLink: Locator;
  readonly giveFeedbackLink: Locator;


  constructor(page: Page) {
    this.page = page;
    this.footer = this.page.getByRole('heading', {level: 2, name: /about/i }).locator('..');
    this.learnMoreLink = this.footer.getByRole('link', { name: /learn more/i} );
    this.giveFeedbackLink = this.footer.getByRole('link', { name: /give feedback/i} );
  }

  async clickLink(linkName: FooterLinkName) {
    await test.step(`click on ${linkName} link`, async() => {
      switch (linkName) {
        case 'learn':
          await this.learnMoreLink.click();
          break;
        case 'feedback':
          await this.giveFeedbackLink.click();
          break;
        default:
          throw new Error('unknown link referenced in footer test');
      }
    });
  }
}