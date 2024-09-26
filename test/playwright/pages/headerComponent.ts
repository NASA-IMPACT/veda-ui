/* eslint-disable playwright/no-conditional-in-test */
import { Locator, Page, test } from '@playwright/test';

type HeaderLinkName = "about" | "dataCatalog" | "exploration" | "stories" | "test" | "contact";

export default class HeaderComponent {
  readonly page: Page;
  readonly navigation: Locator;
  readonly testLink: Locator;
  readonly testDropdownLink: Locator;
  readonly dataCatalogLink: Locator;
  readonly explorationLink: Locator;
  readonly storiesLink: Locator;
  readonly aboutLink: Locator;
  readonly contactButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = this.page.getByLabel('Global Navigation');
    this.dataCatalogLink = this.navigation.getByRole('link', { name: /data catalog/i} );
    this.explorationLink = this.navigation.getByRole('link', { name: /exploration/i} );
    this.storiesLink = this.navigation.getByRole('link', { name: /stories/i} );
    this.testLink = this.navigation.getByRole('button', { name: /test/i} );
    this.testDropdownLink = this.page.getByRole('link', { name: /test dropdown/i} );
    this.aboutLink = this.navigation.getByRole('link', { name: /about/i} );
    this.contactButton = this.navigation.getByRole('button', { name: /contact us/i} );
  }

  async clickLink(linkName: HeaderLinkName) {
    await test.step(`click on ${linkName} link`, async() => {
      switch (linkName) {
        case 'about':
          await this.aboutLink.click();
          break;
        case 'dataCatalog':
          await this.dataCatalogLink.click();
          break;
        case 'exploration':
          await this.explorationLink.click();
          break;
        case 'stories':
          await this.storiesLink.click();
          break;
        case 'test':
          await this.testLink.click();
          break;
        case 'contact':
          await this.contactButton.click();
          break;
        default:
          throw new Error('unknown link referenced in footer test');
      }
    });
  }
}