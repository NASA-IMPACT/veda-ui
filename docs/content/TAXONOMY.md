# Content

- [Content](#content)
  - [Taxonomy Index file](#taxonomy-index-file)
  - [Using a taxonomy in a content type](#using-a-taxonomy-in-a-content-type)

Some of VEDA content types properties are taxonomies.  
These are identified by their id and linked to the full taxonomy definition on the taxonomy index file.

##  Taxonomy Index file

The location of the taxonomy index file is defined through `veda.config.js` and can either be a `json` or `yml` file.  

The different taxonomies are defined as a id keyed list. Each taxonomy item must, at least, have an `id` and `name` properties.  

Example:
```yml
# Key of the taxonomy is thematics.
thematics:
  - id: water
    name: Water Quality
  - id: air
    name: Air Quality

# Key of the taxonomy is sources.
sources:
  - id: devseed
    name: Development Seed
    url: https://developmentseed.org
```

## Using a taxonomy in a content type

To link a content type to a taxonomy, you need to list the different item's `id` under the taxonomy key on your content type.

Example adding `sources` to a dataset:  
```yaml
---
id: my-data
name: My example dataset
description: A dataset with sources

sources:
  - devseed
  - another-source

layers: # ...
---

<Block>
  <Prose>
    ## This is a Dataset

    Once upon a time there was a content string
  </Prose>
</Block>
```

If you want to use a taxonomy item that doesn't exist (e.g. a new source) you will need to add it to the taxonomy index file.