module.exports = {
  plugins: {
    'posthtml-expressions': {
      locals: {
        appTitle: process.env.APP_TITLE,
        appDescription: process.env.APP_DESCRIPTION,
        baseurl: process.env.PUBLIC_URL || ''
      }
    }
  }
};
