// Resolver for resolving aliases in library building
// Related issue in Parcel repo: https://github.com/parcel-bundler/parcel/issues/9519

const path = require('path');
const fs = require('fs-extra');
const { Resolver } = require('@parcel/plugin');
const { alias } = require('../package.json');

const aliases = Object.keys(alias).reduce((acc, key) => {
  const value = alias[key].replace('~', '');
  acc[`${key}`] = `${value}`;
  return acc;
}, {});

// Files with redundant extensions ex. $components/panel (components/panel.d.ts.ts)
const fileExtensions = ['.js', '.ts', '.jsx', '.tsx'];
// Index files with a trailing slash ex. $components/panel/ (components/panel/index.jsx)
const indexFileExtensions = fileExtensions.map((e) => `index${e}`);
// Index files without a trailing slash ex. $components/panel (components/panel/index.jsx)
const pathIndexExtensions = fileExtensions.map((e) => `/index${e}`);

function findMatchingFile(filePath) {
  const filePathParts = filePath.split('/');
  const fileName = filePathParts[filePathParts.length - 1];
  // Files ex. $components/panel.jsx or $components/panel.css
  if (fileName.includes('.')) {
    if (fs.existsSync(filePath)) return filePath;
  }

  for (const extension of [
    ...fileExtensions,
    ...indexFileExtensions,
    ...pathIndexExtensions
  ]) {
    if (fs.existsSync(`${filePath}${extension}`))
      return `${filePath}${extension}`;
  }

  return null;
}

module.exports = new Resolver({
  async resolve({ specifier }) {
    let toReturn;
    for (let aliasKey in aliases) {
      if (specifier.startsWith(aliasKey)) {
        const replaced = specifier.replace(aliasKey, aliases[aliasKey]);
        const rPath = path.join(__dirname, '..', replaced);
        const fileP = findMatchingFile(rPath);
        toReturn = {
          filePath: fileP
        };
        break;
      }
    }
    if (toReturn) return toReturn;
    // Let the next resolver in the pipeline handle this dependency
    else return null;
  }
});
