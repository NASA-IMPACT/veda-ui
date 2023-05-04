/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

// Taxonomies that are expected to exist.
const expectedTaxonomiesTypes = ['sources', 'thematics'];

function validateContent(data, filePath, logger) {
  const entries = Object.entries(data);

  if (!entries.length || entries.some(([, v]) => !Array.isArray(v))) {
    logger.warn({
      message: `Invalid taxonomy file.`,
      hints: [
        `The taxonomy index should contains key-indexed lists of taxonomies.`
      ]
    });
    return {
      data: null,
      filePath: null
    };
  }
  return {
    data,
    filePath
  };
}

async function loadTaxonomies(logger, root, filePath) {
  try {
    const loadPath = path.resolve(root, filePath);
    const ext = path.extname(loadPath);

    const content = await fs.readFile(loadPath, 'utf-8');

    if (ext.match(/json$/i)) {
      const parsed = JSON.parse(content);
      return validateContent(parsed, filePath, logger);
    } else if (ext.match(/(yml|yaml)$/i)) {
      const parsed = yaml.load(content);
      return validateContent(parsed, filePath, logger);
    } else {
      logger.warn({
        message: `Invalid format for taxonomies index file.`,
        hints: [`Provide a taxonomies index in either json or yaml format.`]
      });
      return {
        data: null,
        filePath: null
      };
    }
  } catch (error) {
    logger.warn({
      message: `Taxonomies file not found.`,
      hints: [
        `Provide a path for the taxonomies index file in your veda.config.js`
      ]
    });
    return {
      data: null,
      filePath: null
    };
  }
}

/**
 * Convert a list of taxonomy ids to taxonomy objects.
 * If a given id is not found in the taxonomy pool, it is returned as an object.
 *
 * @param {array} source list of taxonomy ids
 * @param {array} pool list of taxonomy objects
 */
function mapTaxonomyItems(source, pool) {
  return source.map((id) => {
    const tax = pool.find((entry) => entry.id === id);
    return tax || { id: id, name: id };
  });
}

/**
 * Attached the expected taxonomy types to a content type.
 *
 * @param {object} taxonomiesData Taxonomy file loading result
 * @param {object} contentType Content type loading result
 */
function attachTaxonomies(taxonomiesData, contentType) {
  return {
    ...contentType,
    data: contentType.data.map((o) =>
      // Go over all the taxonomy types a content type is expected to have.
      expectedTaxonomiesTypes.reduce((item, taxonomy) => {
        // List of ids of a given taxonomy type added by the user.
        const itemTaxonomy = item[taxonomy] || [];
        // List of metadata of a given taxonomy type provided in the config file.
        const poolTaxonomy = taxonomiesData.data?.[taxonomy] || [];

        return {
          ...item,
          // Convert a list of taxonomy ids to taxonomy objects.
          [taxonomy]: mapTaxonomyItems(itemTaxonomy, poolTaxonomy)
        };
      }, o)
    )
  };
}

function generateTaxonomiesModuleOutput(taxonomiesData) {
  const data = expectedTaxonomiesTypes.reduce(
    (acc, type) => ({ ...acc, [type]: taxonomiesData.data?.[type] || [] }),
    {}
  );

  return JSON.stringify(data);
}

module.exports = {
  loadTaxonomies,
  attachTaxonomies,
  generateTaxonomiesModuleOutput
};
