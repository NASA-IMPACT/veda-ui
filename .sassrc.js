const path = require('path');
const fs = require('fs-extra');

const CWD = process.cwd();
let uswdsPath = path.resolve(CWD, 'node_modules/@uswds/uswds/packages');
// If the build command is from one of the instances
if (!fs.existsSync(uswdsPath)) uswdsPath = path.resolve(CWD,'.veda/ui', 'node_modules/@uswds/uswds/packages');

module.exports = {
  "includePaths": [
    uswdsPath
  ]
}