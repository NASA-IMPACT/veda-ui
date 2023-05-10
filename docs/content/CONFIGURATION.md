# Configuration

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

### Taxonomy Index file

Links to a `json` or `yml` file containing a list of [taxonomies](./TAXONOMY.md) to be used in the app.  

The default configuration is:
```js
  taxonomiesIndex: './taxonomies.yml',
```

### Page overrides
To adapt the Veda dashboard to the individual needs of you instance, some content/component overrides are provided. These overrides allow you to alter certain parts of the application, or inject code without having to fork the UI part of veda.

There are essentially 2 types of possible overrides:
- `Content Overrides` - allow you to change the default content of a page. Like with the different content types (discoveries, datasets), you'll have access to all [MDX_BLOCK.md](./MDX_BLOCKS.md). Depending on the content override you'll also be able to provide some frontmatter variables. The name of the override config variable will follow the `<name>Content` scheme.
- `Component Overrides` - allow you to alter a specific component of the app, by providing new javascript code for it (advanced usage). No Mdx Blocks are available.

The overrides are defined in the `veda.config.js` under `pageOverrides` by specifying the path to the mdx file to load.  
These are the current available overrides:

```js
  pageOverrides: {
    // Type: Content override
    aboutContent: '<file path>.mdx'

    // There are currently no component overrides defined.
  }
```

#### aboutContent
Type: `Content Override`  

The `aboutContent` allows you to specify new content for the global about page (locally at http://localhost:9000/about).  
Besides the new content, this page also frontmatter variables to modify the page title and description.  

Example:
```js
// veda.config.js pageOverrides
aboutContent: './overrides/about.mdx'
```
```jsx
---
title: About the Dashboard
description: A brief description
---

<Block>
  <Prose>
    <p>
      This is my new about page.
    </p>
  </Prose>
</Block>
```