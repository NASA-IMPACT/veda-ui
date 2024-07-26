/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const dedent = require('dedent');
const _ = require('lodash');
const { Resolver } = require('@parcel/plugin');

const stringifyYmlWithFns = require('./stringify-yml-func');
const { loadVedaConfig } = require('./config');
const { getFrontmatterData } = require('./frontmatter');
const {
  validateContentTypeId,
  validateDatasetLayerId
} = require('./validation');
const {
  processTaxonomies,
  generateTaxonomiesModuleOutput
} = require('./taxonomies');
const { withDefaultStrings } = require('./defaults');

async function loadOptionalContent(logger, root, globPath, type) {
  try {
    const loadPath = path.resolve(root, globPath);
    const paths = await fg(loadPath);
    const data = await Promise.all(
      paths.map(async (p) => {
        const frontMatterData = await getFrontmatterData(p, logger);
        if (!frontMatterData) return null;

        if (!frontMatterData.id) {
          logger.error({
            message: `Missing "id" on ${type} ${path.basename(p)}`,
            hints: ['Add an "id" property to the file\'s frontmatter.']
          });
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
    logger.warn({
      message: `Path for "${type}" not found. This will result in an empty list.`,
      hints: [`Provide a path for "${type}" in your veda.config.js`]
    });
    return {
      data: [],
      globPath: '',
      filePaths: []
    };
  }
}

// data = Array<{
//   key: string,
//   data: object,
//   filePath: string
// }>
function generateMdxDataObject(data) {
  const imports = data
    .map(({ key, data, filePath }) =>
      key
        ? `'${key}': {
          data: ${stringifyYmlWithFns(data, filePath)},
          content: () => import('${path.relative(__dirname, filePath)}')
        }`
        : null
    )
    .filter(Boolean);

  return `{
      ${imports.join(',\n')}
    }`;
}

// Using all the "key: path" combinations under config.pageOverrides, load the
// file at the given path, and return an object with a data object and a
// content.
// From something like (config.pageOverrides):
// {
//   aboutContent: './about.mdx',
//   footerComp: './footer.mdx'
// }
// returns:
// {
//   aboutContent: {
//     data: {}, // Any yaml frontmatter defined in the file
//     content: () => MDX // A promise that resolves to the MDX content.
//   },
//   footerComp: {
//     data: {},
//     content: () => MDX
//   }
// }
async function loadPageOverridesConfig(pageOverrides, root, logger) {
  if (!pageOverrides) {
    return '{}';
  }

  const data = await Promise.all(
    Object.entries(pageOverrides).map(async ([key, mdxPath]) => {
      const absolutePath = path.resolve(root, mdxPath);
      try {
        return {
          key,
          data: (await getFrontmatterData(absolutePath, logger)) || {},
          filePath: absolutePath
        };
      } catch (error) {
        // If the file does not exist, skip.
        if (error.code === 'ENOENT') {
          logger.warn({
            message: `File for pageOverrides.${key} failed loading and was skipped.`,
            hints: [
              `Check that the path defined in veda.config.js is correct`,
              `Path: ${mdxPath}`,
              `Resolved to: ${absolutePath}`
            ]
          });
          return null;
        }

        throw error;
      }
    })
  );

  return generateMdxDataObject(data.filter(Boolean));
}

module.exports = new Resolver({
  async resolve({ specifier, logger }) {
    if (specifier.startsWith('veda')) {
      const { isDev, result, root, configPath } = loadVedaConfig();

      if (isDev) {
        logger.warn({
          message:
            'Could not find veda.config.js. Currently using development data.',
          hints: [
            'If you are running the UI repo directly this is expected',
            'Otherwise, create a veda.config.js file in your project config root.'
          ],
          documentationURL:
            'https://github.com/NASA-IMPACT/veda-ui/blob/develop/docs/content/CONFIGURATION.md'
        });
      }

      const datasetsData = _.chain(
        await loadOptionalContent(logger, root, result.datasets, 'datasets')
      )
        .tap((value) => {
          // Data validation
          validateContentTypeId(value);
          // Check the datasets for duplicate layer ids.
          validateDatasetLayerId(value);
        })
        .thru((value) => processTaxonomies(value))
        .value();

      const storiesData = _.chain(
        await loadOptionalContent(logger, root, result.stories, 'stories')
      )
        .tap((value) => {
          // Data validation
          validateContentTypeId(value);
        })
        .thru((value) => processTaxonomies(value))
        .value();

      const datasetsImportData = datasetsData.data.map((o, i) => ({
        key: o.id,
        data: o,
        filePath: datasetsData.filePaths[i]
      }));
      const storiesImportData = storiesData.data.map((o, i) => ({
        key: o.id,
        data: o,
        filePath: storiesData.filePaths[i]
      }));

      const moduleCode = dedent`
        const config = {
          pageOverrides: ${await loadPageOverridesConfig(
            result.pageOverrides,
            root,
            logger
          )},
          strings: ${JSON.stringify(withDefaultStrings(result.strings))},
          booleans: ${JSON.stringify(withDefaultStrings(result.booleans))},
          banner: ${JSON.stringify(result.banner)}
        };

        export const theme = ${JSON.stringify(result.theme) || null};

        export const storyTaxonomies = ${generateTaxonomiesModuleOutput(
          storiesData.data
        )}

        export const getOverride = (key) => config.pageOverrides[key];

        export const userPages = Object.keys(config.pageOverrides)
          .filter((k) => k.startsWith('/'));

        export const getString = (variable) => config.strings[variable];
        export const getBoolean = (variable) => config.booleans[variable];

        export const getConfig = () => config;
        export const getBanner = () => config.banner;

        export const datasets = ${generateMdxDataObject(datasetsImportData)};
        export const stories = ${generateMdxDataObject(storiesImportData)};
      `;

      // Store the generated code in a file for debug purposed.
      // The generated file will be gitignored.
      const fileDebug = dedent`
        /**
        *
        * WARNING!!!
        *
        * This file is the generated output of the veda resolver.
        * It is meant only or debugging purposes and should not be loaded directly.
        *
        */
        ${moduleCode}
      `;
      fs.writeFile(path.join(__dirname, 'veda.out.js'), fileDebug);

      const resolved = {
        // When resolving the mdx files, parcel looks at the parent file to know
        // where to resolve them from and this file has to exist.
        filePath: path.join(__dirname, '/veda.out.js'),
        code: moduleCode,
        invalidateOnFileChange: [
          configPath,
          ...datasetsData.filePaths,
          ...storiesData.filePaths
        ].filter(Boolean),
        invalidateOnFileCreate: [
          { filePath: configPath },
          datasetsData.globPath ? { glob: datasetsData.globPath } : null,
          storiesData.globPath ? { glob: storiesData.globPath } : null
        ].filter(Boolean)
      };
      // console.log('resolved', resolved);
      return resolved;
    }

    // Let the next resolver in the pipeline handle
    // this dependency.
    return null;
  }
});
