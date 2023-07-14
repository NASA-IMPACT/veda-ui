/* eslint-disable @typescript-eslint/no-var-requires */
const { mapValues, kebabCase, uniqBy } = require('lodash');

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
      taxonomy: mapValues(o.taxonomy || {}, (val) =>
        val.map((v) => ({ id: kebabCase(v), name: v }))
      )
    }))
  };
}

function generateTaxonomiesModuleOutput(data) {
  const concat = (arr, v) => (arr || []).concat(v);

  let taxonomyData = {};
  // for loops are faster than reduces.
  for (const { taxonomy } of data) {
    for (const [key, value] of Object.entries(taxonomy || {})) {
      taxonomyData[key] = concat(taxonomyData[key], value);
    }
  }

  const taxonomiesUnique = mapValues(taxonomyData, (val) =>
    uniqBy(val, (t) => t.id)
  );

  return JSON.stringify(taxonomiesUnique);
}

module.exports = {
  processTaxonomies,
  generateTaxonomiesModuleOutput
};
