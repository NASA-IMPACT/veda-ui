import path from 'path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import matter from 'gray-matter';

// If running the tests from delta-config the env environment will contain the
// path, otherwise use the mock
const deltaConfigPath =
  process.env.DELTA_CONFIG_PATH ||
  path.join(__dirname, '../mock/delta.config.js');

/* eslint-disable-next-line */
const deltaConfig = require(deltaConfigPath);

// Get the dataset paths from what's defined in the config.
const root = path.dirname(deltaConfigPath);
const globPath = path.resolve(root, deltaConfig.datasets);
const datasetPaths = fg.sync(globPath);

describe('Test datasets structure', () => {
  it.each(datasetPaths)('Should respect the schema for %s', async (path) => {
    const content = await fs.readFile(path, 'utf-8');
    const frontMatterData = matter(content).data;

    // TODO: Make real tests checking against a properly defined schema.
    expect(frontMatterData.id).not.toBeNull();
  });
});
