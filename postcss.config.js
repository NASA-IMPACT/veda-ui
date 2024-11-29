const url = require('postcss-url');

const plugins = [
  require('autoprefixer'),
  require('postcss-import'),
  url({
    url: (asset) => {
      if (asset.url.startsWith('../fonts/')) {
        return `./fonts/${asset.url.slice('../fonts/'.length)}`;
      }
      if (asset.url.startsWith('../img/')) {
        return `./img/${asset.url.slice('../img/'.length)}`;
      }
      return asset.url;
    }
  })
];

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins
};
