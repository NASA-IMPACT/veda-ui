const path = require('path');
const fs = require('fs-extra');
const { Resolver } = require('@parcel/plugin');

const fileExtensions = ['.js', '.ts', '.jsx', '.tsx'];
const indexFileExtensions = fileExtensions.map((e) => `index${e}`);

function findMatchingFile(filePath) {
  const filePathParts = filePath.split('/');
  const fileName = filePathParts[filePathParts.length - 1];
  // If the file name includes extension ex. panel.jsx or panel.css
  if (fileName.includes('.')) {
    if (fs.existsSync(filePath)) return filePath;
  }

  for (const extension of fileExtensions) {
    if (fs.existsSync(`${filePath}${extension}`))
      return `${filePath}${extension}`;
  }

  for (const extension of indexFileExtensions) {
    if (fs.existsSync(`${filePath}/${extension}`))
      return `${filePath}/${extension}`;
  }

  for (const extension of indexFileExtensions) {
    if (fs.existsSync(`${filePath}${extension}`))
      return `${filePath}${extension}`;
  }
  return null;
}

module.exports = new Resolver({
  async resolve({ specifier }) {
    let toReturn;
    const aliases = {
      $components: '/app/scripts/components',
      $styles: '/app/scripts/styles',
      $utils: '/app/scripts/utils',
      $types: '/app/scripts/types',
      $context: '/app/scripts/context',
      '$data-layer': '/app/scripts/data-layer',
      $test: '/test'
    };
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
    else return null;
    // Let the next resolver in the pipeline handle
    // this dependency.
    // return null;
  }
});
