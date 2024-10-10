/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const fg = require('fast-glob');

const axios = require('axios');

const { loadVedaConfig } = require('./config');
const { getFrontmatterData } = require('./frontmatter');
const {
  validateContentTypeId,
  validateDatasetLayerId
} = require('./validation');
const { processTaxonomies } = require('./taxonomies');

async function loadOptionalContent(root, globPath, type) {
  try {
    const loadPath = path.resolve(root, globPath);
    const paths = await fg(loadPath);
    const data = await Promise.all(
      paths.map(async (p) => {
        const frontMatterData = await getFrontmatterData(p);
        if (!frontMatterData) return null;

        if (!frontMatterData.id) {
          // eslint-disable-next-line no-console
          console.error(`Missing "id" on ${type} ${path.basename(p)}`);
        }

        if (frontMatterData.published === false) return null;

        return frontMatterData;
      })
    );
    return {
      data: data.filter(Boolean),
      globPath: loadPath,
      filePaths: paths
    };
  } catch (error) {
    console.log(error);
    console.log(`Provide a path for "${type}" in your veda.config.js`);
    return {
      data: [],
      globPath: '',
      filePaths: []
    };
  }
}

async function reconcileDataWithStacMetadata(dataset) {
  if (!dataset.layers) return;

  const reconciledLayerData = await Promise.all(
    dataset.layers.map(async (layer) => {
      // fetch stac
      const stacApiEndpointToUse =
        layer.stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
      try {
        // console.log(`${stacApiEndpointToUse}/collections/${layer.id}`);
        const response = await axios.get(
          `${stacApiEndpointToUse}/collections/${layer.stacCol}`
        );
        // console.log(`data_is_good: `, response.data);
        if (!response.data.title) throw Error('No proper title');
        return {
          title: response.data.title,
          description: response.data.description,
          ...layer
        };
        // reconcile here
      } catch (e) {
        console.log('REQUEST ERROR');
        return {
          title: 'error'
        };
      }
    })
  );
  return {
    ...dataset,
    layers: reconciledLayerData
  };

  // await setTimeout(() => {
  //   // eslint-disable-next-line no-console
  //   console.log(data.layers);
  //   // eslint-disable-next-line no-console
  //   console.log('end of data');
  // }, 2);
  // return data;
}

(async () => {
  // async code goes here
  const { isDev, result, root } = loadVedaConfig();
  console.log(isDev);
  const datasetsData = _.chain(
    await loadOptionalContent(root, result.datasets, 'datasets')
  )
    .tap((value) => {
      // Data validation
      validateContentTypeId(value);
      // Check the datasets for duplicate layer ids.
      validateDatasetLayerId(value);
    })
    .thru((value) => processTaxonomies(value))
    .value();

  const datasetsImportData = await Promise.all(
    datasetsData.data.map(async (o, i) => ({
      key: o.id,
      data: await reconcileDataWithStacMetadata(o), // reconcile the data
      filePath: datasetsData.filePaths[i]
    }))
  );

  fs.writeFileSync(
    './parcel-resolver-veda/dataset-output.json',
    JSON.stringify(datasetsImportData)
  );
})();
