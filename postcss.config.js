const path = require('path');
const fs = require('fs-extra');
const CWD = process.cwd();

const vedaPath = path.resolve(CWD, '.veda/ui');
const isVedaInstance = fs.existsSync(vedaPath);

let basePath = CWD;
let vedaUIPath = CWD;
let contentPaths = [`${vedaUIPath}/app/**/*.{js,jsx,ts,tsx}`];

let uswdsPath = path.resolve(
  basePath,
  'node_modules/@trussworks/react-uswds/lib'
);
let reactCalendarPath = path.resolve(
  basePath,
  'node_modules/react-calendar/src/**/*.{js,jsx,ts,tsx}'
);

if (isVedaInstance) {
  vedaUIPath = vedaPath;
  uswdsPath = path.resolve(
    vedaUIPath,
    'node_modules/@trussworks/react-uswds/lib'
  );
  reactCalendarPath = path.resolve(
    vedaUIPath,
    'node_modules/react-calendar/dist/**/*.css'
  );
  contentPaths = [
    ...contentPaths,
    `${basePath}/overrides/**/*.{js,jsx,ts,tsx}`
  ];
}

const allContentPaths = [
  ...contentPaths,
  `${uswdsPath}/index.css`,
  reactCalendarPath
];

let plugins = [require('autoprefixer'), require('postcss-import')];
const purge = require('@fullhuman/postcss-purgecss')({
  content: allContentPaths,
  safelist: {
    deep: [/usa-banner$/],
    greedy: [/^usa-banner/]
  }
});

if (process.env.NODE_ENV !== 'development') plugins = [...plugins, purge];

module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-safe-parser',
  plugins
};
