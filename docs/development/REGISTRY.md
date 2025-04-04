## Library build

As VEDA-UI evolves into a standalone library consumed by multiple projects, there are several things that developers need to be aware of.

### Local development

We now provide a script to streamline local development between `veda-ui` and `next-veda-ui`.

#### Option 1: Scripted setup (Recommended)

If you have both `veda-ui` and `next-veda-ui` cloned in sibling directories (e.g., `~/dev/veda-ui` and `~/dev/next-veda-ui`), run the following inside the `veda-ui` directory:

```sh
./utils/link-next.sh
```

This script:
- Builds `veda-ui`
- Links it globally
- Links it into `next-veda-ui`
- Starts watching for changes in `veda-ui` and rebuilds automatically

Once the script runs successfully, open a new terminal and start the Next.js app from within `next-veda-ui`:

```sh
npm run dev
```

You can now edit components in `veda-ui` and any changes will automatically rebuild and reflect in the running Next.js app.

> **Note:** During rebuilds, you might briefly see a `Module not found: Can't resolve '/veda-ui/lib/main.css'` error in Next.js. This is expected and will resolve once the rebuild finishes.

> **Troubleshooting:** If you encounter issues like `Cannot find module '@teamimpact/veda-ui'`, try deleting `node_modules` in both projects and running `yarn install` again before retrying the script.

#### Option 2: Manual linking

Build locally first:

```sh
yarn buildlib
```

Link the library globally:

```sh
yarn link
```

Then, in your consumer project (e.g., `next-veda-ui`):

```sh
yarn link @teamimpact/veda-ui
```

Your project should now use the local version of the `veda-ui` library.

### Build with pipeline

As of September 2024, VEDA-UI has two build pipelines: one for the application build (where VEDA-UI is a submodule) and one for the library build. Both pipelines are triggered whenever changes are merged into the staging or production branches. This ensures that no changes break either of the build pipelines.

Note: Package publishing is not yet part of the CI system since the library is still under active development.

### Publish

As of January 2025, VEDA-UI is published to NASA IMPACT's npm registry.

## Authentication

To publish the package, make sure you are authenticated with teamimpact's NPM registry. Use the following steps to set up authentication and scope:

1. Set the scoped registry for @teamimpact:

```sh
npm config set @teamimpact:registry=https://registry.npmjs.org/
```

2. Add your authentication token for the registry:

```sh
npm config set //registry.npmjs.org/:_authToken=<your-token>
```

Replace `<your-token>` with the actual token provided to you.

> **Important:** Avoid using `npm logout` while working with the registry locally. Logging out invalidates the authentication token globally, which will disrupt publishing and other registry-related actions.

Before publishing live, test the process with:

```sh
npm publish --dry-run
```

When the package is ready to be published, you can:

```sh
npm publish
```

#### Version Number Discrepancy and Pre-release tags

There is currently an issue where the version number of VEDA-UI in the registry does not always match the version number of VEDA-UI when used as a submodule. Since VEDA-UI as a submodule follows a bi-weekly release schedule to support various instances, we are using pre-release tags to handle cases where additional changes need to be published without changing the version number.

For example, if the current version is `v5.7.0` and further changes are necessary before the next scheduled release, the registry will use a pre-release tag like `v5.7.0-alpha.x`.

To check the latest version in the registry and ensure proper versioning, run:

```sh
npm view @teamimpact/veda-ui version
```

Currently, developers manually update the version number in the `package.json` file to publish with pre-release tags (instead of using `npm tag`) because a formal release cycle for the library has not yet been established.

