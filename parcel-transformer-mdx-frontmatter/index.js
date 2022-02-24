const { Transformer } = require('@parcel/plugin');
const matter = require('gray-matter');

// Removes the frontmatter from mdx files.
module.exports = new Transformer({
  async transform({ asset }) {
    const code = await asset.getCode();

    // Remove frontmatter from file.
    const { content } = matter(code);
    asset.setCode(content);

    return [asset];
  }
});
