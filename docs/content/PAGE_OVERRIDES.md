# Overrides

- [Overrides](#overrides)
  - [Content Override reference](#content-override-reference)
    - [aboutContent](#aboutcontent)
    - [homeContent](#homecontent)
  - [Component Override reference](#component-override-reference)
    - [headerBrand](#headerbrand)
    - [pageFooter](#pagefooter)
    - [homeHero](#homehero)
  - [Creating complex overrides](#creating-complex-overrides)


To adapt the Veda dashboard to the individual needs of you instance, some content/component overrides are provided. These overrides allow you to alter certain parts of the application, or inject code without having to fork the UI part of veda.

There are essentially 2 types of possible overrides:
- `Content Overrides` - allow you to change the default content of a page. Like with the different content types (stories, datasets), you'll have access to all [MDX_BLOCK.md](./MDX_BLOCKS.md). Depending on the content override you'll also be able to provide some frontmatter variables. The name of the override config variable will follow the `<name>Content` scheme.
- `Component Overrides` - allow you to alter a specific component of the app, by providing new javascript code for it (advanced usage). No Mdx Blocks are available.

> 🍀 Although it is not an override, custom pages are also defined under the `pageOverrides` key. See [CUSTOM_PAGES.md](./CUSTOM_PAGES.md) form more information.

The overrides are defined in the `veda.config.js` under `pageOverrides` by specifying the path to the mdx file to load.  
These are the current available overrides:

```js
  pageOverrides: {
    // Type: Content override
    aboutContent: '<file path>.mdx',
    homeContent: '<file path>.mdx',
    
    // Type: Component override
    headerBrand: '<file path>.mdx',
    pageFooter: '<file path>.mdx',
    homeHero: '<file path>.mdx',
  }
```

## Content Override reference

### aboutContent
`Content Override`

The `aboutContent` allows you to specify new content for the about page (locally at http://localhost:9000/about).  
Besides the new content, this page also uses frontmatter variables to modify the page title and description.  

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

### homeContent
`Content Override`

The `homeContent` allows you to specify new content for the home page.  
Besides the new content, this page also uses frontmatter variables to modify the page title and description.  

Example:
```js
// veda.config.js pageOverrides
homeContent: './overrides/home.mdx'
```
```jsx
---
title: Welcome to VEDA
description: A dashboard to explore and visualize earth data
---

import FeaturedStories from "$veda-ui-scripts/components/home/featured-stories";

<Block>
  <Prose>
    ## Welcome

    Welcome to VEDA, your one-stop destination for all things related to earth datasets! Our website offers a vast collection of datasets that are designed to help researchers, policymakers, and concerned citizens. Our team of experts has curated and compiled the most up-to-date and comprehensive data on from various sources.
  </Prose>
</Block>

<FeaturedStories />
```

> 🧑‍🏫 You can import and use the `FeaturedStories` component to include a section listing the stories with the `featured` flag. It is important that this component is not inside a `Block`.

### developmentContent
`Content Override`

The `developmentContent` allows you to specify new content for the development page (locally at http://localhost:9000/development).  
Besides the new content, this page also uses frontmatter variables to modify the page title and description.  

Example:
```js
// veda.config.js pageOverrides
developmentContent: './overrides/development.mdx'
```
```jsx
---
title: The development page
description: A brief description
---

<Block>
  <Prose>
    <p>
      This is my new development page.
    </p>
  </Prose>
</Block>
```

## Component Override reference

### headerBrand
`Component Override`  
_⚠️ Note that on a component override the `<Block>` components are not available and should not be used._

The `headerBrand` override can be used to replace the logo in the header.  
It is likely that some styling is needed to ensure that it is displayed properly.

### pageFooter
`Component Override`  
_⚠️ Note that on a component override the `<Block>` components are not available and should not be used._

The `pageFooter` override can be used to replace the content of the footer.  
The footer behavior will remain the same being hidden in some pages, like the exploration.  

Props passed to this component:  
- `appBuildTime` - Timestamp of when the app was build.
- `appVersion` - Current app version from the instance's package.json
- `appUiVersion` - Current veda-ui version that the instance is using.

### homeHero
`Component Override`  
_⚠️ Note that on a component override the `<Block>` components are not available and should not be used._

The `homeHero` override can be used to replace the page hero section on the homepage.  
It is likely that some styling is needed to ensure that it is displayed properly.

## Creating complex overrides

There may be some situations where the required override is more complex than what the `.mdx` file allows for. If you want to have multiple `React` components or create `styled-components`, doing so in the `.mdx` file will prove challenging.

> 🙋 **Why is that so?** To declare variables in an `.mdx` file, they have to be exported as it is the only way for them to be recognized as code instead of content. This, and the lack of separation of concerns between code and content makes things hard to reason about as the override complexity grows.

It is recommended that for complex overrides you create a `.jsx` or `.tsx` file with one exported component, and then import it fom the `.mdx` file.

Example:
```js
// veda.config.js pageOverrides
headerBrand: './overrides/header-brand/index.mdx'
```
`file: overrides/header-brand/index.mdx`
```jsx
import Cmp from './component';

<Cmp {...props} />
```
`file: overrides/header-brand/component.tsx`
```jsx
// imports omitted for brevity

const TitleHeading = styled.h2`
  color: teal;
`;

const name = 'Overriding this!';

export default function Component(props) {
  return (
    <div>
      <TitleHeading>{name}</TitleHeading>
    </div>
  );
}
```

There's another important caveat to take into account when using these complex overrides.  
**All module imports must be done from the `veda-ui` module.**  

This can be done by prefixing the module name with `$veda-ui/`.  
Example:
```jsx
import React from '$veda-ui/react';
import styled from '$veda-ui/styled-components';
```

However if the module does not exist on `veda-ui` (check the `package.json` to be sure), you'll need to install it and then import it normally.

> 🙋 **Why is that so?** The `veda-ui` submodule contains all the modules that the app needs to run. When we want to use one for an override from a config instance, we need to make sure we use the same one otherwise there may be version clashes and several libraries (like `react`) don't function well when multiple instances are used in the same app.

---


**Using veda-ui components**  

It is possible to you components located in `veda-ui` in these overrides. Using the path alias `$veda-ui-scripts` will land you in the `scripts` directory and from there you just need to specify the component path.

Example:
```jsx
import { Tip } from '$veda-ui-scripts/components/common/tip';
```

_This is an internal escape hatch. Use it at your own risk._