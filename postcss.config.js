module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './dist/index.html',
        './app/**/*.{js,jsx,ts,tsx}',
        '@trussworks/react-uswds/lib/index.css'
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: {
        deep: [/usa-alert$/, /usa-site-alert$/],
        greedy: [/^usa-alert/, /^usa-site-alert/]
      }
    })
  ]
};
