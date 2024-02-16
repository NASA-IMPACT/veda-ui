import { test as base } from '@playwright/test';
import AboutPage from './aboutPage';
import AnalysisPage from './analysisPage';
import AnalysisResultsPage from './analysisResultsPage';
import ExplorePage from './explorePage';
import FooterComponent from './footerComponent';
import HeaderComponent from './headerComponent';
import HomePage from './homePage';
import CatalogPage from './catalogPage';
import DatasetPage from './datasetPage';
import StoryPage from './storyPage';

export const test = base.extend<{
  aboutPage: AboutPage;
  analysisPage: AnalysisPage;
  analysisResultsPage: AnalysisResultsPage;
  footerComponent: FooterComponent;
  explorePage: ExplorePage;
  headerComponent: HeaderComponent;
  homePage: HomePage;
  catalogPage: CatalogPage;
  datasetPage: DatasetPage;
  storyPage: StoryPage
}> ({
  aboutPage: async ({page}, use) => {
    await use(new AboutPage(page));
  },
  analysisPage: async ({page}, use) => {
    await use(new AnalysisPage(page));
  },
  analysisResultsPage: async ({page}, use) => {
    await use(new AnalysisResultsPage(page));
  },
  catalogPage: async ({page}, use) => {
    await use(new CatalogPage(page));
  },
  datasetPage: async ({page}, use) => {
    await use(new DatasetPage(page));
  },
  explorePage: async ({page}, use) => {
    await use(new ExplorePage(page));
  },
  homePage: async ({page}, use) => {
    await use(new HomePage(page));
  },
  storyPage: async ({page}, use) => {
    await use(new StoryPage(page));
  },
  headerComponent: async ({page}, use) => {
    await use(new HeaderComponent(page));
  },
  footerComponent: async ({page}, use) => {
    await use(new FooterComponent(page));
  },
});

export const expect = test.expect;