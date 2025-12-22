// https://github.com/parcel-bundler/parcel/issues/1209#issuecomment-942927265
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV;

const dotenvFiles = [
  '.env',
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV === 'test' ? null : '.env.local',
  `.env.${NODE_ENV}`,
  `.env.${NODE_ENV}.local`
].filter(Boolean);

const env = {};

for (let dotenvFile of dotenvFiles) {
  const config = dotenv.config({ path: dotenvFile });
  if (config.parsed) {
    Object.assign(env, config.parsed);
  }
}

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
