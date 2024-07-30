const path = require('path');
const fs = require('fs-extra');
const CWD = process.cwd();

const vedaPath = path.resolve(CWD, '.veda/ui');

const isVedaInstance = fs.existsSync(vedaPath);
const contentPaths = isVedaInstance
  ? [
      '.veda/ui/app/**/*.{js,jsx,ts,tsx}',
      '@trussworks/react-uswds/lib/index.css'
    ]
  : ['./app/**/*.{js,jsx,ts,tsx}', '@trussworks/react-uswds/lib/index.css'];

let plugins = [require('autoprefixer'), require('postcss-import')];
const purge = require('@fullhuman/postcss-purgecss')({
  content: contentPaths,
  safelist: {
    deep: [/usa-banner$/],
    greedy: [/^usa-banner/]
  }
});

if (process.env.NODE_ENV !== 'development') plugins = [...plugins, purge];

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins
};
