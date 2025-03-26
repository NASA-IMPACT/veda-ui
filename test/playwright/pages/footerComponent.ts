/* eslint-disable playwright/no-conditional-in-test */
import { Locator, Page, test } from '@playwright/test';

type FooterLinkName = 'about' | 'contact';

export default class FooterComponent {
  readonly page: Page;
  readonly footer: Locator;
  readonly aboutLink: Locator;
  readonly contactUsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = this.page.locator('footer');
    this.aboutLink = this.footer.getByRole('link', { name: /about/i });
    this.contactUsLink = this.footer.getByRole('button', {
      name: /contact/i
    });
  }

  async clickLink(linkName: FooterLinkName) {
    await test.step(`click on ${linkName} link`, async () => {
      switch (linkName) {
        case 'about':
          await this.aboutLink.click();
          break;
        case 'contact':
          await this.contactUsLink.click();
          break;
        default:
          throw new Error('unknown link referenced in footer test');
      }
    });
  }
}
