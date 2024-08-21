const plugins = [require('autoprefixer'), require('postcss-import')];

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins
};
