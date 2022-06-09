/* eslint-disable @typescript-eslint/no-var-requires */
const { Resolver } = require('@parcel/plugin');
const { default: ThrowableDiagnostic } = require('@parcel/diagnostic');
const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const matter = require('gray-matter');

const stringifyYmlWithFns = require('./stringify-yml-func');
const { loadDeltaConfig } = require('./config');

async function getFrontmatterData(filePath, logger) {
  const content = await fs.readFile(filePath, 'utf-8');
  try {
    // Pass an empty options object to avoid data being cached which is a
    // problem if there is an error. When an error happens the data is
    // cached as empty and no error are thrown the second time.
    return matter(content, {}).data;
  } catch (error) {
    logger.error({
      message: error.message,
      codeFrames: [
        {
          filePath,
          code: error.mark.buffer,
          codeHighlights: [
            {
              start: {
                line: error.mark.line,
                column: error.mark.column
              },
              end: {
                line: error.mark.line,
                column: error.mark.column
              }
            }
          ]
        }
      ]
    });
    return null;
  }
}

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
      hints: [`Provide a path for "${type}" in your delta.config.js`]
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
              `Check that the path defined in delta.config.js is correct`,
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

function throwErrorOnDuplicate(list) {
  let ids = {
    // id: 'location'
  };

  list.data.forEach((item, idx) => {
    const id = item.id;
    // No duplicate. Store path in case a duplicate is found.
    if (!ids[id]) {
      ids[id] = list.filePaths[idx];
    } else {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: `Duplicate id property found.`,
          hints: [
            'Check the `id` on the following files',
            ids[id],
            list.filePaths[idx]
          ]
        }
      });
    }
  });
}

module.exports = new Resolver({
  async resolve({ specifier, logger }) {
    if (specifier.startsWith('delta/thematics')) {
      const { isDev, result, root, configPath } = loadDeltaConfig();

      if (isDev) {
        logger.warn({
          message:
            'Could not find delta.config.js. Currently using development data.',
          hints: [
            'If you are running the UI repo directly this is expected',
            'Otherwise, create a delta.config.js file in your project config root.'
          ],
          documentationURL:
            'https://github.com/NASA-IMPACT/delta-config/blob/develop/docs/CONFIGURATION.md'
        });
      }

      // Load thematics.
      if (!result.thematics) {
        throw new ThrowableDiagnostic({
          diagnostic: {
            message: 'Path for "thematics" not found.',
            hints: ['Provide a path for "thematics" in your delta.config.js']
          }
        });
      }

      // Thematics is not optional, but the check is done above.
      const thematicsData = await loadOptionalContent(
        logger,
        root,
        result.thematics
      );

      const datasetsData = await loadOptionalContent(
        logger,
        root,
        result.datasets,
        'datasets'
      );

      const discoveriesData = await loadOptionalContent(
        logger,
        root,
        result.discoveries,
        'discoveries'
      );

      throwErrorOnDuplicate(thematicsData);
      throwErrorOnDuplicate(datasetsData);
      throwErrorOnDuplicate(discoveriesData);

      // Check the datasets for duplicate layer ids.
      datasetsData.data.forEach((item, idx) => {
        let ids = {
          // id: true
        };
        item.layers?.forEach((layer, lIdx) => {
          if (!layer.id) {
            throw new ThrowableDiagnostic({
              diagnostic: {
                message: 'Missing dataset layer `id`',
                hints: [
                  `The layer (index: ${lIdx}) is missing the [id] property.`,
                  `Check the dataset [${item.id}] at`,
                  datasetsData.filePaths[idx]
                ]
              }
            });
          }

          if (!ids[layer.id]) {
            ids[layer.id] = true;
          } else {
            throw new ThrowableDiagnostic({
              diagnostic: {
                message: 'Duplicate dataset layer `id`',
                hints: [
                  `The layer id [${layer.id}] has been found multiple times.`,
                  `Check the dataset [${item.id}] at`,
                  datasetsData.filePaths[idx]
                ]
              }
            });
          }
        });
      });

      // Prepare data to be used by generateMdxDataObject();
      const thematicsImportData = thematicsData.data.map((o, i) => ({
        key: o.id,
        data: o,
        filePath: thematicsData.filePaths[i]
      }));
      const datasetsImportData = datasetsData.data.map((o, i) => ({
        key: o.id,
        data: o,
        filePath: datasetsData.filePaths[i]
      }));
      const discoveriesImportData = discoveriesData.data.map((o, i) => ({
        key: o.id,
        data: o,
        filePath: discoveriesData.filePaths[i]
      }));

      const moduleCode = `
        export const config = {
          pageOverrides: ${await loadPageOverridesConfig(
            result.pageOverrides,
            root,
            logger
          )}
        };

        export const thematics = ${generateMdxDataObject(thematicsImportData)};
        export const datasets = ${generateMdxDataObject(datasetsImportData)};
        export const discoveries = ${generateMdxDataObject(
          discoveriesImportData
        )};

        // Create thematics list.
        // Merge datasets and discoveries with respective thematics.
        const toDataArray = (v) => Object.values(v).map(d => d.data);

        export default toDataArray(thematics).map((t) => {
          const filterFn = (d) => d.id && d.thematics?.includes(t.id);
          return {
            ...t,
            datasets: toDataArray(datasets).filter(filterFn),
            discoveries: toDataArray(discoveries).filter(filterFn)
          };
        });
      `;

      // Store the generated code in a file for debug purposed.
      // The generated file will be gitignored.
      fs.writeFile(
        path.join(__dirname, 'delta-thematic.out.js'),
        `/**
 *
 * WARNING!!!
 *
 * This file is the generated output of the delta/thematic resolver.
 * It is meant only or debugging purposes and should not be loaded directly.
 *
*/
${moduleCode}`
      );

      const resolved = {
        // When resolving the mdx files, parcel looks at the parent file to know
        // where to resolve them from and this file has to exist. However if we
        // use a glob for the file path, parcel doesn't complain that the file
        // doesn't exist.
        filePath: path.join(__dirname, '/delta.js'),
        code: moduleCode,
        invalidateOnFileChange: [
          configPath,
          ...thematicsData.filePaths,
          ...datasetsData.filePaths,
          ...discoveriesData.filePaths
        ],
        invalidateOnFileCreate: [
          { filePath: configPath },
          ...[
            { glob: thematicsData.globPath },
            datasetsData.globPath ? { glob: datasetsData.globPath } : null,
            discoveriesData.globPath ? { glob: discoveriesData.globPath } : null
          ].filter(Boolean)
        ]
      };
      // console.log('resolved', resolved);
      return resolved;
    }

    // Let the next resolver in the pipeline handle
    // this dependency.
    return null;
  }
});
