const url = require('postcss-url');

const plugins = [
  require('autoprefixer'),
  require('postcss-import'),
  // USWDS SCSS files use relative paths like '../fonts/' to reference assets
  // When we compile these SCSS files, PostCSS needs to resolve these paths
  // We convert '../' to './' because the final './' paths work correctly in
  // Next.js when it resolves paths relative to the built CSS file in node_modules/veda-ui/lib/
  url({
    url: (asset) => {
      return asset.url.replace('../', './');
    }
  })
];

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins
};
