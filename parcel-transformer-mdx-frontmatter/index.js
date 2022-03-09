const { Transformer } = require('@parcel/plugin');
const matter = require('gray-matter');

// Removes the frontmatter from mdx files.
module.exports = new Transformer({
  async transform({ asset }) {
    const code = await asset.getCode();

    try {
      // Remove frontmatter from file.
      const { content } = matter(code, {});
      asset.setCode(content);
    } catch (error) {
      // Return empty if errored. The parcel-resolver-evolution will take care
      // of logging the correct errors.
      return [];
    }

    return [asset];
  }
});
