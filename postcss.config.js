module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-uncss')({
      html: './app/index.html'
    })
  ]
};
