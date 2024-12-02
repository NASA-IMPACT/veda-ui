const url = require('postcss-url');

const plugins = [
  require('autoprefixer'),
  require('postcss-import'),
  url({
    url: (asset) => {
      const uswdsBasePath =
        '/node_modules/@developmentseed/veda-ui/node_modules/@uswds/uswds/dist';

      if (asset.url.startsWith('../fonts/')) {
        return `${uswdsBasePath}/fonts/${asset.url.slice('../fonts/'.length)}`;
      }
      if (asset.url.startsWith('../img/')) {
        return `${uswdsBasePath}/img/${asset.url.slice('../img/'.length)}`;
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
