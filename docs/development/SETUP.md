# Installation and Usage
The steps below will walk you through setting up your own instance of the project. 

## Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v20 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) Package manager

## Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```
nvm install
```

Install Node modules:

```
yarn install
```
This command  will install all the dependencies and devtools needed for local development. 

## Usage

### Config files
Configuration is done using [dot.env](https://parceljs.org/features/node-emulation/#.env-files) files.

These files are used to simplify the configuration of the app and should not contain sensitive information.

Copy the `.env.local-sample` to `.env.local` to add your configuration variables.
```sh
cp .env.local-sample .env.local
```

### Mapbox Token

Get your Mapbox access token from Mapbox Dashboard. Put the key in `.env.local` file.

### Starting the app

```
yarn serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:9000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

## Development

### Documentation

- Refer to [ARCHITECTURE](./ARCHITECTURE.md) docs to read about architecture.
- Refer to [PAGE_OVERRIDES](./PAGE_OVERRIDES.md) for information about the component/content overriding feature.

### Lint & TS-Check

#### GitHub Action
VEDA-UI includes a GitHub action for checking TypeScript and lint errors. If your changes trigger any of these errors, your pull request (PR) will be marked as 'Some checks were not successful.'

#### Pre-commit Hook
Additionally, there's a pre-commit hook that performs the same error checks. This helps developers identify and address issues at an earlier stage. If you need to bypass the check (to make a local temporary commit etc.), include the `--no-verify`` flag in your commit command.

## Deployment
To prepare the app for deployment run:

```
yarn build
```
or
```
yarn stage
```
This will package the app and place all the contents in the `dist` directory.
The app can then be run by any web server.

**When building the site for deployment provide the base url trough the `PUBLIC_URL` environment variable. Omit the trailing slash. (E.g. https://example.com)**

If you want to use any other parcel feature it is also possible. Example:
```
PARCEL_BUNDLE_ANALYZER=true yarn parcel build app/index.html
```
