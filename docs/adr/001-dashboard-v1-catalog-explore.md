# Dashboard V1 (Catalog exploration) architecture

* Status: accepted
* Deciders: @hanbyul-here @michaelgsuttles @danielfdsilva @nerik 
* Date: 2023/01/30

Technical Story: https://github.com/NASA-IMPACT/veda-architecture/issues/162

## Context and Problem Statement

The implementation of the [dashboard V1](https://www.figma.com/file/SA0u0sVdw5vM7g9ulV5Xgw/Wireframes?node-id=2455%3A32113&t=pG3PMb33Q1a1NmhV-0) requires some changes in the overall architecture.

The data catalog (and comprising search) and the relationships between content types (for example: "discoveries that use this dataset") are the main reasons why an architecture overhaul may be needed.

The current architecture relies on a series of static files and all the relationships and data structures are created during build time via a series of plugins. There are limitations to the available "queries" because such queries need to have been precomputed - meaning that a discrete list of options must be considered beforehand.

In the case of a search functionality it is not possible to know all the options the user will search. To solve this we'd need to have all possible searchable content in memory, which means the user would have to download a lot of content just to enable search.

## Decision Drivers

- Effort and time to implement
- Support of needed functionalities

## Considered Options

- [1] Maintain current architecture
- [2] CMS
- [3] Hybrid
- [4] Veda Datastore

## Decision Outcome

Start with the implementation of solution 1 (Maintain current architecture). If the search needs become too complex or the search index too heavy due to a large increase of dataset number, implement a third party search solution resulting in option 3 (Hybrid)

### Positive Consequences

- Minimal changes
- Quick implementation cycle

### Negative Consequences

- Problems pertaining to the implementation of content authoring flows and WYSIWYG elements will remain as they currently are. [^1]

## Pros and Cons of the Options

### [1] Maintain current architecture

Extract a search index from MDX files' frontmatter at build time. Through the use of custom plugins create all the needed content relationships

- 💚 Keep the existing architecture
- 💚 Minimal changes needed
- 💚 Maintain instance replicability [^2]
- 🚩 Search is limited by the (potentially exponential) size of the index. This issue forces us to limit search capabilities to some properties of the frontmatter (title, description, etc)
- 🚩 Can be tricky to build a plugin to extract content relationships from the MDX content.
- 🚩 Limits future possibilities of building a content authoring system [^1]

### [2] CMS

Move all the content to a headless CMS. Rearchitecture the frontend to fetch content from the CMS' endpoint.

- 💚 Simplify content relationships.
- 💚 Powerful search
- 💚 Ground work for any CMS type features (authoring workflows, WYSIWYG elements)
- 🚩 Huge undertaking as it would require a complete new system and content migration.
- 🚩 Dedicated team for the backend.
- 🚩 Given the very custom nature of the project the different WYSIWYG elements would likely need to be custom built.
- 🚩 Harder instance replicability [^2]

### [3] Hybrid

Sync all MDX data with a 3rd party service as a CI step (E.g. Elastic Search), then use said service search capabilities endpoint. This basically build on top of _Maintain current architecture_ solution

- 💚 Keep the existing architecture.
- 💚 Very powerful search.
- 💚 Would support [faceted search](https://github.com/NASA-IMPACT/veda-architecture/issues/162#issuecomment-1387647740)
- 🚩 Can be tricky to build a plugin to extract content relationships from the MDX content.
- 🚩 Limits future possibilities of building a content authoring system [^1]
- 🚩 Harder instance replicability [^2]

### [4] Veda Datastore

Use the VEDA datastore as the source-of-truth for search rather than the MDX content.

- 🚩 Needs to rearchitecure the frontend.
- 🚩 Since the data in the datastore and the data in veda-config have pretty different structures, this would lead to information mismatch and potentially the need to update multiple content configurations at the same time.
- 🚩 Harder instance replicability [^2]

_Could be revisited in the future if all the data is moved to the datastore, resolving the duplication issue_

[^1]: A content authoring could still be custom built to output the content into files, instead of a database. An inspiration for this could be the Netlify CMS, currently being used as a prototype. _A complete editor to power this content system should be considered almost a separate project._

[^2]: The current architecture was setup to allow new instances of VEDA to be created easily. The architecture relies on 2 repos: `veda-config` and `veda-ui`. The config repo holds all the content and needed settings, while the ui repo holds the app code. Users need only to fork the config repo and add their own content/change the settings, being able to update the underlying ui module when new features are released.
_Recent research tells us that this functionality may not be as needed as it was originaly thought, but it is something to take into consideration._
