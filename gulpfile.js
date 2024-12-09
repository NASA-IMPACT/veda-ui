const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const gulp = require('gulp');
const del = require('del');
const portscanner = require('portscanner');
const log = require('fancy-log');
const uswds = require('@uswds/compile');

uswds.settings.version = 3;

uswds.paths.dist.img = './dist/img';

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const readPackage = () => JSON.parse(fs.readFileSync('package.json'));

// Set the version in an env variable.
process.env.APP_VERSION = readPackage().version;
process.env.APP_UI_VERSION = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'))
).version;
process.env.APP_BUILD_TIME = Date.now();

const parcelCli = path.join(__dirname, './node_modules/parcel/lib/cli.js');
const parcelConfig = path.join(__dirname, '.parcelrc');

// /////////////////////////////////////////////////////////////////////////////
// ----------------------- Watcher and custom tasks --------------------------//
// ---------------------------------------------------------------------------//

// Function to register file watching
function watcher() {
  // Add custom watcher processes, below this line
  // gulp.watch('glob', callbackFn);

  // ---
  // Watch static files. DO NOT REMOVE.
  gulp.watch(['static/**/*'], copyFiles);
  gulp.watch(['admin/**/*'], copyNetlifyCMS);
}

// /////////////////////////////////////////////////////////////////////////////
// ---------------------------- Base tasks -----------------------------------//
// ---------------------------------------------------------------------------//

function clean() {
  // Remove build cache and dist.
  return del(['dist', '.parcel-cache']);
}

// Simple task to copy the static files to the dist directory. The static
// directory will be watched so that files are copied when anything changes.
function copyFiles() {
  // When running directly from this repo both sources will be the same, but
  // when this runs from the config repo, the CWD will be set to the config
  // repo, effectively copying static files from there. We need to also use an
  // absolute url to ensure any default files are copied as well.
  return gulp
    .src([path.join(__dirname, 'static/**/*'), 'static/**/*'])
    .pipe(gulp.dest('dist'));
}

function copyNetlifyCMS() {
  // Copy Netifly CMS file to static folder
  return gulp.src('admin/**/*').pipe(gulp.dest('dist/admin'));
}

function copyUswdsImages() {
  return uswds.copyImages();
}

// Task that uses Parcel to build the library version of the VEDA UI.
// It specifies the entry file, output directory, and custom Parcel configuration file.
// This task will generate distributable library (`lib` folder) that other projects can consume.
function parcelBuildLib(cb) {
  const args = [
    'build',
    'app/scripts/index.ts',
    '--dist-dir=lib',
    '--config',
    '.parcelrc-lib'
  ];

  const pr = spawn('node', [parcelCli, ...args], {
    stdio: 'inherit'
  });
  pr.on('close', (code) => {
    cb(code ? 'Build failed' : undefined);
  });
}

// Copy the uswds assets to the veda-ui lib directory.
// This makes things easier for the veda components to consume
// when the veda-ui library is used as a dependency.
function copyUswdsAssetsToLibBundle() {
  return gulp
    .src(
      [
        './node_modules/@uswds/uswds/dist/fonts/**/*',
        './node_modules/@uswds/uswds/dist/img/**/*'
      ],
      { base: './node_modules/@uswds/uswds/dist' }
    )
    .pipe(gulp.dest('lib'));
}

// Below are the parcel related tasks. One for the build process and other to
// start the development server.

// Parcel will look up the directory tree an search for the highest
// package.json to use. When running this directly from the UI repo (for
// development) we need to actively point parcel to the correct target
// otherwise the site doesn't get built.
const parcelTarget = process.cwd() === __dirname ? ['app/index.html'] : [];

function parcelServe(cb) {
  portscanner.findAPortNotInUse(9000, 9999, function (error, port) {
    if (port !== 9000) {
      log.warn(`  Port 9000 is busy.`);
    }

    // const args = ['--config', parcelConfig, '--port', port, '--open'];
    const args = ['--config', parcelConfig, '--port', port];

    // Run parcel in serve mode using the same stdio that started gulp. This is
    // needed to ensure the output is colored and behaves correctly.
    spawn('node', [parcelCli, 'serve', ...args, ...parcelTarget], {
      stdio: 'inherit'
    });
    cb(error);
  });
}

function parcelBuild(cb) {
  // Build the app using parcel. Since the build task finishes, we have to
  // listen for it to mark the gulp task as finished.

  const args = [
    '--target',
    'veda-app',
    '--config',
    parcelConfig,
    '--public-url',
    process.env.PUBLIC_URL || '/'
  ];

  const pr = spawn('node', [parcelCli, 'build', ...args], {
    stdio: 'inherit'
  });
  pr.on('close', (code) => {
    cb(code ? 'Build failed' : undefined);
  });
}

// //////////////////////////////////////////////////////////////////////////////
// ---------------------------- Task export -----------------------------------//
// ----------------------------------------------------------------------------//

module.exports.clean = clean;

// Task orchestration used during the development process.
module.exports.serve = gulp.series(
  gulp.parallel(
    // Task to copy the files. DO NOT REMOVE
    copyFiles,
    copyNetlifyCMS,
    copyUswdsImages
  ),
  gulp.parallel(watcher, parcelServe)
);

// do not deploy netlify cms to production
const parallelTasks =
  process.env.NODE_ENV === 'production'
    ? gulp.parallel(copyFiles, copyUswdsImages)
    : gulp.parallel(copyFiles, copyNetlifyCMS, copyUswdsImages);

module.exports.buildlib = gulp.series(
  clean,
  copyUswdsAssetsToLibBundle,
  parcelBuildLib
);

// Task orchestration used during the production process.
module.exports.default = gulp.series(clean, parallelTasks, parcelBuild);
