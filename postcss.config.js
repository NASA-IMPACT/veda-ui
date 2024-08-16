const path = require('path');
const fs = require('fs-extra');
const CWD = process.cwd();

const vedaPath = path.resolve(CWD, '.veda/ui');
const isVedaInstance = fs.existsSync(vedaPath);

let basePath = CWD;
let uswdsPath = path.resolve(
  basePath,
  'node_modules/@trussworks/react-uswds/lib'
);
let reactCalendarPath = path.resolve(
  basePath,
  'node_modules/react-calendar/src/**/*.{js,jsx,ts,tsx}'
);

if (isVedaInstance) {
  basePath = vedaPath;
  uswdsPath = path.resolve(
    basePath,
    'node_modules/@trussworks/react-uswds/lib'
  );
  reactCalendarPath = path.resolve(
    basePath,
    'node_modules/react-calendar/dist/**/*.css'
  );
}

const contentPaths = [
  `${basePath}/app/**/*.{js,jsx,ts,tsx}`,
  `${uswdsPath}/index.css`,
  reactCalendarPath
];

let plugins = [require('autoprefixer'), require('postcss-import')];
const purge = require('@fullhuman/postcss-purgecss')({
  content: contentPaths,
  safelist: {
    deep: [/usa-banner$/, /usa-icon$/],
    greedy: [/^usa-banner/, /^usa-icon/]
  }
});

if (process.env.NODE_ENV !== 'development') plugins = [...plugins, purge];

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins
};
