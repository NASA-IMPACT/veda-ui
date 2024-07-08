let plugins = [require('autoprefixer'), require('postcss-import')];

if (process.env.NODE_ENV === 'production') {
  plugins = [
    ...plugins,
    require('@fullhuman/postcss-purgecss')({
      content: [
        './dist/index.html',
        './app/**/*.{js,jsx,ts,tsx}',
        '@trussworks/react-uswds/lib/index.css'
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ];
}
module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins: plugins
};
