const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const gulp = require('gulp');
const del = require('del');
const portscanner = require('portscanner');
const log = require('fancy-log');

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const readPackage = () => JSON.parse(fs.readFileSync('package.json'));

// Set the version in an env variable.
process.env.APP_VERSION = readPackage().version;
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

  const args = ['--config', parcelConfig];

  const pr = spawn('node', [parcelCli, 'build', ...args, ...parcelTarget], {
    stdio: 'inherit'
  });
  pr.on('close', () => cb());
}

// //////////////////////////////////////////////////////////////////////////////
// ---------------------------- Task export -----------------------------------//
// ----------------------------------------------------------------------------//

module.exports.clean = clean;

// Task orchestration used during the development process.
module.exports.serve = gulp.series(
  gulp.parallel(
    // Task to copy the files. DO NOT REMOVE
    copyFiles
  ),
  gulp.parallel(watcher, parcelServe)
);

// Task orchestration used during the production process.
module.exports.default = gulp.series(
  clean,
  gulp.parallel(
    // Task to copy the files. DO NOT REMOVE
    copyFiles
  ),
  parcelBuild
);
