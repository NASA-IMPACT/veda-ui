# Configuration

- [Configuration](#configuration)
  - [veda.config.js](#vedaconfigjs)
    - [Page overrides](#page-overrides)
  - [Meta files](#meta-files)

The base properties used by Veda are set through the `.env` file.  
This includes values like the application title, and contact email. These values are then used throughout the app.

The `.env` file contains a list of all available variables and comments explaining what they are used for.

## veda.config.js

The `veda.config.js` file is an additional configuration file for veda.  
It is through this file that you specify how the Veda content can be found.

This is done by providing a glob path for each one of the [content types](./CONTENT.md). (Datasets, Discoveries).  
The default configuration is:
```js
datasets: './datasets/*.data.mdx'
discoveries: './discoveries/*.discoveries.mdx'
```

### Page overrides
To adapt the Veda dashboard to the individual needs of you instance, some content/component overrides are provided. These overrides allow you to alter certain parts of the application, or inject code without having to fork the UI part of veda.

See [PAGE_OVERRIDES](./PAGE_OVERRIDES.md) for a full list of elements to customize.

## Meta files

_There is currently not a lot of customization that can be done to meta images._

The following meta files must exist and be placed in the `static/meta` folder:
```
apple-touch-icon.png
favicon.ico
icon.svg
meta-image.png
site.webmanifest
```