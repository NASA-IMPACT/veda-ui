const { Resolver } = require('@parcel/plugin');
const { default: ThrowableDiagnostic } = require('@parcel/diagnostic');
const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const matter = require('gray-matter');

function loadDeltaConfig() {
  try {
    const configPath = fs.realpathSync(process.env.DELTA_CONFIG_PATH);
    return {
      configPath,
      result: require(configPath),
      root: path.dirname(configPath)
    };
  } catch (error) {
    const configPath = fs.realpathSync(
      path.join(__dirname, '../mock/delta.config.js')
    );
    return {
      isDev: true,
      configPath: configPath,
      result: require(configPath),
      root: path.dirname(configPath)
    };
  }
}

async function loadOptionalContent(logger, root, globPath, type) {
  try {
    const loadPath = path.resolve(root, globPath);
    const paths = await fg(loadPath);
    const data = await Promise.all(
      paths.map(async (p) => {
        const content = await fs.readFile(p, 'utf-8');
        const { data } = matter(content);

        if (!data.id) {
          logger.error({
            message: `Missing "id" on ${type} ${path.basename(p)}`,
            hints: ['Add an "id" property to the file\'s frontmatter.']
          });
        }

        if (data.published === false) return null;

        return data;
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

function generateImports(data, paths) {
  // {
  //   id1: {
  //     data: {},
  //     content: () => MDX
  //   },
  //   id2: {
  //     data: {},
  //     content: () => MDX
  //   }
  // }
  const imports = data
    .map((o, i) =>
      o.id
        ? `'${o.id}': {
          data: ${JSON.stringify(o)},
          content: () => import('${path.relative(__dirname, paths[i])}')
        }`
        : null
    )
    .filter(Boolean);

  return `{
    ${imports.join(',\n')}
  }`;
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
          documentationURL: 'http://example.com/'
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

      // Figure out how to structure:
      // - export thematics, datasets and discoveries with their content. (frontmatter and mdx)
      // - Export list of thematics with datasets and discoveries (only frontmatter)

      const moduleCode = `
        export const thematics = ${generateImports(
          thematicsData.data,
          thematicsData.filePaths
        )};
        export const datasets = ${generateImports(
          datasetsData.data,
          datasetsData.filePaths
        )};
        export const discoveries = ${generateImports(
          discoveriesData.data,
          discoveriesData.filePaths
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
