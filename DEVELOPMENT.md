# Delta Dev Notes

The base idea behind Delta architecture is the separation of concerns between ui code and configuration.  
That is why the ui repo (`delta-ui`) is used as a submodule of `delta-config`.
A user wishing to setup a new Delta instance, only has to fork `delta-config`, change the configuration variables and the content, and you are ready to launch your own instance.

For development purposes, the ui repo can be run directly without the need to have the `delta-config` code around.  
In this case the data is loaded from the `mock/` folder, which replicates the structure one would find in `delta-config`.

## Configuration
The delta configuration consists in a series of `MDX` files, organized in 3 different content types:
- thematic
- discoveries
- datasets

These `MDX` files are not pure MDX but tailored to Delta.  
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

The `thematic` files define the thematic areas of the app (one file per thematic area).  
Each file in `discoveries` represent a discovery story which may belong to more than one thematic area. The relationship is established by adding the `id` of the thematic area under the `thematics` list.  
Much like `discoveries` each entry in `datasets` can be paired with one or more thematic areas which is also done by adding the `id` of the thematic area under the `thematics` list.

## delta/thematics
To be able to load all the configuration and content into Delta, it uses a custom parcel resolver which allows us to create a faux module (`delta/thematics`) which when imported will resolve to our configuration.

```js
import deltaThematics, {
  thematics,
  datasets,
  discoveries
} from 'delta/thematics';

// deltaThematics -> Contains a list of all the thematic areas and the properties defined in their frontmatter.
[
  {
    "id": "fire",
    // ... Other properties present in the thematic frontmatter.
    "datasets": [
      // List of datasets related to this thematic area.
      {
        "id": "no2",
        // ... Other properties present in the dataset frontmatter.
      }
    ],
    "discoveries": [
      // List of discoveries related to this thematic area.
      {
        "id": "history",
        // ... Other properties present in the discovery frontmatter.
      }
    ]
  },
  // another thematic area.
]

// thematics, datasets, discoveries -> All have the same structure which is an object keyed by the content type id.
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

### parcel-resolver-evolution

[Custom resolver module](https://github.com/NASA-IMPACT/delta-ui/blob/main/parcel-resolver-evolution/index.js) is used to create the faux module that outputs the structure above. It reads all the mdx files from disk, uses the values in the frontmatter to establish the correct relationships and outputs the correct module code.  
The content part (the MDX) is not handled by this resolver, but left untouched and when trying to import a `MDX` file, the correct resolver will kick in.

### parcel-transformer-mdx-front

Since having frontmatter code is not supported by `MDX` files, this custom resolver, strips the frontmatter before reaching the `MDX` resolver.

### Troubleshooting

If you run into errors after making changes to mdx files, it could be from [Parcel's cache issue](https://github.com/parcel-bundler/parcel/issues/7247). Try deleting Parcel cache by running `rm -rf .parcel-cache`. If this doesn't resolve your problem, try `yarn clean` to start from a clean slate and file an issue.