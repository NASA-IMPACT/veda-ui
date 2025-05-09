/* eslint-disable fp/no-mutating-methods */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const fg = require('fast-glob');

const catalogPaths = fg.globSync('**/mock/datasets/*.mdx');
const storyPaths = fg.globSync('**/mock/stories/*.mdx');
const catalogNames = [];
const datasetIds = [];
const datasetIdDisableExplore = [];
const storyNames = [];

for (const catalog of catalogPaths) {
  const catalogData = matter.read(catalog).data;
  catalogNames.push(catalogData['name']);
  datasetIds.push(catalogData['id']);
  if (catalogData['disableExplore'] == true) {
    datasetIdDisableExplore.push(catalogData['id']);
  }
}

for (const story of storyPaths) {
  const storyData = matter.read(story).data;
  storyNames.push(storyData['name']);
}

const testDataJson = {
  catalogs: catalogNames,
  datasetIds: datasetIds,
  stories: storyNames,
  disabledDatasets: datasetIdDisableExplore
};

fs.writeFile(
  path.join(__dirname, 'playwrightTestData.json'),
  JSON.stringify(testDataJson),
  (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    } else {
      // eslint-disable-next-line no-console
      console.info('new test data file generated');
    }
  }
);
