/* eslint-disable @typescript-eslint/no-var-requires */
const { kebabCase, uniqBy } = require('lodash');

/**
 * Converts the taxonomies to an array of objects
 *
 * @param {object} contentType Content type loading result
 */
function processTaxonomies(contentType) {
  return {
    ...contentType,
    data: contentType.data.map((o) => ({
      ...o,
      taxonomy: (o.taxonomy || [])
        .map((tx) => {
          if (!tx.name || !tx.values?.length) return null;

          return {
            name: tx.name,
            values: tx.values.map((v) => ({ id: kebabCase(v), name: v }))
          };
        })
        .filter(Boolean)
    }))
  };
}

function generateTaxonomiesModuleOutput(data) {
  const concat = (arr, v) => (arr || []).concat(v);

  let taxonomyData = {};
  // for loops are faster than reduces.
  for (const { taxonomy } of data) {
    for (const { name, values } of taxonomy) {
      if (!name || !values?.length) continue;

      taxonomyData[name] = concat(taxonomyData[name], values);
    }
  }

  const taxonomiesUnique = Object.entries(taxonomyData).map(([key, tx]) => ({
    name: key,
    values: uniqBy(tx, (t) => t.id)
  }));

  return JSON.stringify(taxonomiesUnique);
}

module.exports = {
  processTaxonomies,
  generateTaxonomiesModuleOutput
};
