# Configuration

- [Configuration](#configuration)
  - [veda.config.js](#vedaconfigjs)
    - [Page overrides](#page-overrides)
    - [Strings](#strings)
  - [Meta files](#meta-files)

The base properties used by Veda are set through the `.env` file.  
This includes values like the application title, and contact email. These values are then used throughout the app.

The `.env` file contains a list of all available variables and comments explaining what they are used for.

## veda.config.js

The `veda.config.js` file is an additional configuration file for veda.  
It is through this file that you specify how the Veda content can be found.

This is done by providing a glob path for each one of the [content types](./CONTENT.md). (Datasets, Stories).  
The default configuration is:
```js
datasets: './datasets/*.data.mdx'
stories: './stories/*.stories.mdx'
```

### Page overrides
To adapt the Veda dashboard to the individual needs of you instance, some content/component overrides are provided. These overrides allow you to alter certain parts of the application, or inject code without having to fork the UI part of veda.

See [PAGE_OVERRIDES](./PAGE_OVERRIDES.md) for a full list of elements to customize.

### Strings

The `strings` object allows you to customize the nomenclature used in some parts of the application so that it better reflects your use case. Since these values will need to be used in different contexts, a one (singular) and other (plural) form of each term is required.

The default values are:
```js
strings: {
  stories: {
    one: 'Story',
    other: 'Stories'
  }
}
```

However if the value you want to use is the same for both forms, you can simply provide a string instead of an object:
```js
strings: {
  sheep: 'Sheep'
}
```

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