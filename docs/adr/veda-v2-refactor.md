# Dashboard V1 (Catalog exploration) architecture

* Status: **In Review**, In Progress, Done
* Authors: @j08lue, @sandrahoang686, @faustoperez
* Deciders: @j08lue, @faustoperez, @hanbyul-here
* As of: 2024/03

## Context and Problem Statement

VEDA UI 1.0 was built as a reusable white-label application - easy for independent science data and information projects to stand up and configure their own instance with their content. The assumption was that projects would reuse the entire application and change mostly the styling and scalable content items such as datasets and stories, and would only need to change a few other elements. The application (pages, functional components; VEDA UI) is separate from content (VEDA config) and pages and elements can be changed via component overrides.

In 2023, our team supported two new projects to integrate VEDA UI for their needs: the U.S. Greenhouse Gas Center (earth.gov/ghgcenter) and the Earth Information Center (EIC; earth.gov). These projects had much wider needs for customization or adaptation, mostly related to the context of the project:
1. Different thematic categorization of content with hierarchies or tags
2. Project-specific headers and disclaimers on several pages, also static / functional ones like the data catalog
3. Changes to navigation - main, secondary, page
4. Additional pages
5. New CMS-typical content types like events or announcements

We are expecting new instances to start using VEDA in 2024.

### Challenge 1: Cumbersome customization to the degree required
Implementing these additional customizations proved to be cumbersome with the current application structure, because they require page overrides and new customization options across the application, which grew fast in complexity.

### Challenge 2: Dependency injection
The separation of application and content is currently done via Git submodules: the VEDA UI library source tree is injected into a Configuration project and then they are built together. This works and is lightweight, but is not a very common pattern which new contributors to the project need to 

### Challenge 3: Unmaintained design system
VEDA UI currently uses a design system developed by DevSeed, which is not well maintained anymore. While being a great choice to get the application started, it now shows its shortcomings: It is not optimized for accessibility, which has become a more central requirement, and it misses many standard UI components that larger community design systems include.

### Need for a decision: continue to modify, refactor, or rewrite?
The challenges mentioned above have perceivably slowed down our development of new features and made addressing integration project needs cumbersome in recent quarters. We expect the number of instances of VEDA UI to grow, which is great, but makes the need to make a decision whether to make fundamental changes to the application architecture more pressing.

We also need to take into account that the evolution of the application with new and improved features needs to continue and we have limited team resources.


## Decision Drivers

- Investment payoff
- Compatibility with continued support for instances with feature evolution
- Developer velocity
- Ease of support for required customizations


## Considered Options

- [1] Continue with current application architecture + design system
- [2] Continue with current application architecture + replace design system
- [3] Refactor component library + replace design system + Rearchitect 
- [4] Rewrite component library + replace design system + Rearchitect

## Decision Outcome

- ✔️[3] Refactor component library + replace design system + Rearchitect 

Move more control to the instance level, modularize the core ui library to expose core feature components and smaller reusable components, and create a data layer as part of the core ui library that is ideally also consumed at the instance level that manages data fetching and MDX parsing so that components are data agnostic. Introduce a new design system that is well-maintained and community-backed to create standardization across styles and accessibility patterns.

### 1. Move Routing from the core ui library to the instance level
Routing and what pages exist should be determined at the instance level. Currently, routing is handled at the core UI library level so supporting additional/removal of pages requires override logic. Moving this to the instance level allows developers/stakeholders to independently manage their routes and pages.
### 2. Feature components in the core ui library composed at the instance level
Currently, the core UI library handles the composition of each page because of its control over routing. However, pages and what they render should shift to the instance level so developers/stakeholders can control what is rendered within each page view. The core UI library should expose feature components (containers) that deliver a core feature in the VEDA dashboard such as the A&E feature. 
### 3. Modularize and create smaller reusable components
The core UI library should also expose smaller reusable components like date pickers, form elements, analysis tools, etc… (“presentational/dumb” components). This way developers/stakeholders for example can compose a page view with the A&E feature from the core UI library and consume other reusable components to construct their page view. This also now allows developers to build their own custom components on the instance side and directly incorporate them. 
### 4. Create a data layer that manages all data fetching
The proposed data layer is designed to handle all data fetching, including STAC calls, and MDX parsing. Think of it as a versatile data utilities library. Introducing this layer would enable components in the core UI library to remain data-agnostic. In the event of scaling to additional or different data sources, expansion can be easily accomplished by integrating them into this centralized layer. Smart components (larger and stateful) would then efficiently consume this data layer.
> **Integrating with [stac-react](https://github.com/developmentseed/stac-react/tree/main)**: Because these React hooks manage data fetching to the STAC API using the Context API provider pattern, this could just be used directly as it is already its own data layer. We would have to decide where we wrap the Provider though. Ideally, at the instance level, we would wrap the provider at the highest level in the tree either around the router or specific view containers and then consume these hooks down the hierarchy on the instance side. The components in the core ui library would be prop driven so this way they can be truly data agnostic and accept whatever data passed in.

*Architectural Diagram of the Refactor*
![Architectural Diagram](./diagrams/veda-v2-refactor-adr-dataprovider-diagram.png)

TODO-LEFT-OFF-FROM-HERE-SANDRA
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
