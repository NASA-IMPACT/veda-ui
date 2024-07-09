module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
  ]
};
