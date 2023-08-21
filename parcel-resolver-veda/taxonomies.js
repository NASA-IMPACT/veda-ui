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

          // Guard against multiple values for Grade and Uncertainty.
          if (
            ['Grade', 'Uncertainty'].includes(tx.name) &&
            tx.values.length > 1
          ) {
            throw new Error(
              `Taxonomy ${tx.name} can only have one value. Check dataset ${o.id}`
            );
          }

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
    // eslint-disable-next-line fp/no-mutating-methods
    values: uniqBy(tx, (t) => t.id).sort((a, b) => a.name.localeCompare(b.name))
  }));

  return JSON.stringify(taxonomiesUnique);
}

module.exports = {
  processTaxonomies,
  generateTaxonomiesModuleOutput
};
