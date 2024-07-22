module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './app/**/*.{js,jsx,ts,tsx}',
        '@trussworks/react-uswds/lib/index.css'
      ],
      safelist: {
        deep: [/usa-banner$/],
        greedy: [/^usa-banner/]
      }
    })
  ]
};
