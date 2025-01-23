# Deployment

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
