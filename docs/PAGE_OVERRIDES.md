# Overrides

💡 These notes cover the development part of the content overrides. For usage check [veda-config](https://github.com/NASA-IMPACT/veda-config/).

The veda ui should be flexible enough to allow instances to be configured to fit that instance's needs.  
Perhaps one instance needs a different footer or a different logo. It is not possible to provide configuration options for all use cases, so we want to allow for components to be replaced entirely via overrides.

There are essentially 2 types of possible overrides:
- Content Overrides - Allows the instance to replace the content of a given page. They should allow the usage of all MDX Blocks, and can include frontmatter variables.
- Component Overrides - Allows the instance to alter specific components of the app, by providing new javascript code for it. No MDX Blocks nor frontmatter available.

🧑‍🎓  When new component or content overrides are added, do not forget to update the documentation in [veda-config](https://github.com/NASA-IMPACT/veda-config/) and add the override key to `veda` types (`parcel-resolver-veda/index.d.ts`).

## Content overrides
A content override will show a content loading placeholder while the MDX data is being loaded, supports MDX Blocks and frontmatter variables.
Let's look at an example to convert a content page to an overridable content.

```jsx
// Some imports omitted for simplicity.

function About() {
  return (
    <Layout>
      <PageHero
        title='Example about page'
      />
      <FoldProse>
        <p>
          This is the root about. Here you can find info about the whole app,
          with its many thematic areas.
        </p>
      </FoldProse>
    </Layout>
  );
}

export default About;
```

There are 2 things here we want to allow the user to customize:
- title
- content

The title will be provided through the frontmatter and the content will be the body. Since this is a `ContentOverride` all MDX Blocks are supported.  

We start by using the `ContentOverride` component.  
This component accepts a `with` prop which specifies the override key to use.  

🧑‍🎓 This is the key to be added to `veda.config.js`, and being a content override it should follow the `<name>Content` schema.  

The `children` of the component will be the default value in case the override is not provided by the user.

The new `About` would look like:

```diff
 // Some imports omitted for simplicity.
+import { ContentOverride } from '$components/common/page-overrides';

 function About() {
   return (
     <Layout>
       <PageHero
         title='Example about page'
       />
+      <ContentOverride with='aboutContent'>
         <FoldProse>
           <p>
             This is the root about. Here you can find info about the whole app,
             with its many thematic areas.
           </p>
         </FoldProse>
+      </ContentOverride>
     </Layout>
   );
 }

 export default About;
```

Now that we handled the content, we just need to include the frontmatter variables. To achieve this we use the `getOverride` function from `veda`:

```diff
 // Some imports omitted for simplicity.
+import { getOverride } from 'veda'; 
 import { ContentOverride } from '$components/common/page-overrides';
+
+const aboutContent = getOverride('aboutContent');

 function About() {
   return (
     <Layout>
       <PageHero
-        title='Example about page'
+        title={aboutContent?.data.title || 'Example about page'}
       />
       <ContentOverride with='aboutContent'>
         <FoldProse>
           <p>
             This is the root about. Here you can find info about the whole app,
             with its many thematic areas.
           </p>
         </FoldProse>
       </ContentOverride>
     </Layout>
   );
 }

 export default About;
```

All the frontmatter variables are available under `data`, but it is important to account for the fact that the override may be undefined, hence `aboutContent?.data.title`.

The instance would then be able to override the footer through an MDX file:
```jsx
---
title: About the Dashboard
---

<Block>
  <Prose>
    <p>
      This is my new about page.
    </p>
  </Prose>
</Block>
```

## Component overrides
A component override will not render anything until it loads to avoid flashes and does not allows MDX Blocks nor frontmatter variables.  
To implement a component override, use the `ComponentOverride` and define an override key via the `with` prop. The `children` of `ComponentOverride` will be rendered by default if there is no override defined.  
Any other `prop` will be made available in the MDX override file.

```jsx
// Some imports omitted for simplicity.
import { ComponentOverride } from '$components/common/page-overrides';

function Layout(props) {
  return (
    <div>
      <PageHeader title={props.title} />
      <main>
        {props.children}
      </main>
      <ComponentOverride with='page-footer' title={props.title}>
        <PageFooter /* This is the default footer */ />
      </ComponentOverride>
    </div>
  );
}

export default Layout;
```

The instance would then be able to override the footer through an MDX file:
```jsx
import MyFooterWidget from './someplace/footer-widget.js';

export function LocalWidget() {
  return (
    <p>Hello!</p>
  );
}

<footer>
  <p>My custom footer for page titled {props.title}</p>
  <MyFooterWidget />
  <LocalWidget />
</footer>
```

## Manually testing the overrides
To manually check that the override you just created works as expected, modify the `mock/veda.config.js` file and add the override key and file path under `pageOverrides`:

Example:
```js
  pageOverrides: {
    yourOverrideKey: '<file path>.mdx'
  }
```

Then create the MDX file with the new content:

```jsx
<p>This is the new <a href='/root'>content</a></p>
```

💡 To ensure all settings are reloaded stop your development server and restart cleaning the cache: `yarn clean && yarn serve`
