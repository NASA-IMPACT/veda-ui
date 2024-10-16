import { test as base } from '@playwright/test';
import AboutPage from './aboutPage';
import CatalogPage from './catalogPage';
import ContactModal from './contactModal';
import ConsentBanner from './consentBanner';
import DatasetPage from './datasetPage';
import DatasetSelectorComponent from './datasetSelectorComponent';
import ExplorePage from './explorePage';
import FooterComponent from './footerComponent';
import HeaderComponent from './headerComponent';
import NotebookConnectModal from './notebookConnectModal';
import StoriesPage from './storiesPage';


export const test = base.extend<{
  aboutPage: AboutPage;
  catalogPage: CatalogPage;
  contactModal: ContactModal;
  consentBanner: ConsentBanner;
  datasetSelectorComponent: DatasetSelectorComponent;
  datasetPage: DatasetPage;
  explorePage: ExplorePage;
  footerComponent: FooterComponent;
  headerComponent: HeaderComponent;
  notebookConnectModal: NotebookConnectModal;
  storiesPage: StoriesPage;
}> ({
  aboutPage: async ({page}, use) => {
    await use(new AboutPage(page));
  },
  catalogPage: async ({page}, use) => {
    await use(new CatalogPage(page));
  },
  contactModal: async ({page}, use) => {
    await use(new ContactModal(page));
  },
  consentBanner: async ({page}, use) => {
    await use(new ConsentBanner(page));
  },
  datasetPage: async ({page}, use) => {
    await use(new DatasetPage(page));
  },
  datasetSelectorComponent: async ({page}, use) => {
    await use(new DatasetSelectorComponent(page));
  },
  explorePage: async ({page}, use) => {
    await use(new ExplorePage(page));
  },
  footerComponent: async ({page}, use) => {
    await use(new FooterComponent(page));
  },
  headerComponent: async ({page}, use) => {
    await use(new HeaderComponent(page));
  },
  notebookConnectModal: async ({page}, use) => {
    await use(new NotebookConnectModal(page));
  },
  storiesPage: async ({page}, use) => {
    await use(new StoriesPage(page));
  },
});

export const expect = test.expect;