# Veda Dev Notes

The base idea behind Veda architecture is the separation of concerns between ui code and configuration.  
That is why the ui repo (`veda-ui`) is used as a submodule of `veda-config`.
A user wishing to setup a new Veda instance, only has to fork `veda-config`, change the configuration variables and the content, and you are ready to launch your own instance.

For development purposes, the ui repo can be run directly without the need to have the `veda-config` code around.  
In this case the data is loaded from the `mock/` folder, which replicates the structure one would find in `veda-config`.

## Configuration
The veda configuration consists in a series of `MDX` files, organized in 2 different content types:
- discoveries
- datasets

These `MDX` files are not pure MDX but tailored to Veda.  
The only difference is that they have a `YAML Front Matter` to support configuration values, some of which (like `id`) are used during build to establish relationships between the different pieces of content.

The structure of each content type is slightly different but they share some properties.
```
---
id: fire
name: 'Fire'
---

## Welcome

Here's something about this site! on fire?

<SomeComponent />
```

## veda
To be able to load all the configuration and content into Veda, it uses a custom parcel resolver which allows us to create a faux module (`veda`) which when imported will resolve to our configuration.

```js
import { datasets, discoveries } from 'veda';

// datasets, discoveries -> All have the same structure which is an object keyed by the content type id.
{
  ["content-type-id"] : {
    "data": {
      // ... All the properties present in the content type's frontmatter.
    },
    "content": fn() // Async function to load the content.
  }
  // ... Other pieces of content
}
```

### parcel-resolver-veda

[Custom resolver module](https://github.com/NASA-IMPACT/veda-ui/blob/main/parcel-resolver-veda/index.js) is used to create the faux module that outputs the structure above. It reads all the mdx files from disk, uses the values in the frontmatter to establish the correct relationships and outputs the correct module code.  
The content part (the MDX) is not handled by this resolver, but left untouched and when trying to import a `MDX` file, the correct resolver will kick in.

The faux module is virtual and is not loaded from a file, but for debug purposes the generated module code is output to `parcel-resolver-veda/veda.out.js` during runtime. This file is gitignored, so you'll have to run the project to see it.

### parcel-transformer-mdx-front

Since having frontmatter code is not supported by `MDX` files, this custom resolver, strips the frontmatter before reaching the `MDX` resolver.

### Troubleshooting

If you run into errors after making changes to mdx files, it could be from [Parcel's cache issue](https://github.com/parcel-bundler/parcel/issues/7247). Try deleting Parcel cache by running `rm -rf .parcel-cache`. If this doesn't resolve your problem, try `yarn clean` to start from a clean slate and file an issue.

## Module aliases

To simplify file access we use aliases for the most common paths so that they can be imported more easily.  
For example, to access file inside the `styles` folder you'd use `$styles/filename` instead of having to use a relative path. This get's very handy when we have several nested folders.

Currently the following aliases exist:
- `$components/<file>` => `app/scripts/components`
- `$styles/<file>` => `app/scripts/styles`
- `$utils/<file>` => `app/scripts/utils`
- `$context/<file>` => `app/scripts/context`

To add a new alias, add the respecting naming and path under `alias` in the `package.json`.  
The test runner (Jest) also has to be made aware of the mapping, and this is done through some code in `jest.config.js` under `moduleNameMapper`. You shouldn't need to do anything there, but if things break it is a place to look at.
