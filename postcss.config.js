let plugins = [require('autoprefixer'), require('postcss-import')];
const purge = require('@fullhuman/postcss-purgecss')({
  content: [
    './app/**/*.{js,jsx,ts,tsx,html}',
    '@trussworks/react-uswds/lib/index.css'
  ],
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
