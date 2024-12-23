# VEDA UI theming guide

## Overview

VEDA UI library uses the U.S. Web Design System (USWDS) as its foundation for styling and theming. This guide explains how to set up and customize styles in your application when using VEDA UI components.

## Setup requirements

To use VEDA UI components with proper styling, your application needs to:

1. Install the required dependencies:

```bash
# VEDA UI uses @uswds/uswds@^3.8.1 as a peer dependency
# Install the same or compatible version to avoid styling issues
npm install @uswds/uswds@^3.8.1 sass
# or
yarn add @uswds/uswds@^3.8.1 sass
```
> **Note:** Version compatibility is important. VEDA UI currently uses USWDS v3.8.1 as a peer dependency. Using a significantly different version might cause styling inconsistencies.

2. Configure your build system to handle SASS files
3. Create the necessary theme configuration files

## Theme configuration

### USWDS theming system

USWDS uses a token-based design system that provides a good foundation for consistent styling. The [USWDS theme documentation](https://designsystem.digital.gov/documentation/settings/) provides detailed information about all tokens and settings available for customizing your application's visual design.

### Style import order

The order of importing styles is important so that proper styles cascading can be applied:

1. USWDS theme settings
2. VEDA UI styles
3. Custom application styles

```scss
// 1. Theme settings
// This imports all theme-related settings which can be configured in _uswds-theme.scss
// Variables like theme-image-path, theme-font-path, color tokens etc.
@forward 'uswds-theme';

// 2. USWDS core styles
// Imports all USWDS components and styles
// For smaller bundle size, you can optionally import specific packages instead:
// @use '@uswds/uswds/packages/usa-button';
// @use '@uswds/uswds/packages/usa-modal';
// etc.
@forward 'uswds';

// 3. USWDS core utilities
// Provides all USWDS functions, mixins, and tokens
// The 'as *' syntax allows direct usage without namespacing
// e.g. color(gray-90) instead of uswds.color(gray-90)
@use 'uswds-core' as *;

// Note: For custom styles that override VEDA UI and/or USWDS,
// create a separate custom.scss file and import it last in your application
// Import order in your app:
// 1. import '@developmentseed/veda-ui/lib/main.css';
// 2. import './styles/index.scss';
// 3. import './styles/custom.scss';
```

## Example implementation

Below is an example of implementing VEDA UI theming in a Next.js application. While your specific setup may vary based on your framework and build tools, the core concepts remain the same.

### Next.js example

1. Configure SASS options in `next.config.js`:

```js
module.exports = {
 sassOptions: {
   includePaths: [
     'node_modules/@uswds/uswds',
     'node_modules/@uswds/uswds/dist',
     'node_modules/@uswds/uswds/packages',
   ]
 }
};
```

2. Create theme configuration in `styles/_uswds-theme.scss`:

```scss
// This section showcases basic USWDS configuration examples
// For all available settings and detailed documentation, visit:
// https://designsystem.digital.gov/documentation/settings
@use 'uswds-core' with (
 // Asset path configurations
 $theme-image-path: '/img',
 $theme-font-path: '/fonts',

 // General settings
 $theme-show-notifications: false,
 $utilities-use-important: true,

 // Typography settings
 $theme-font-weight-semibold: '600',
 $theme-type-scale-md: 8,

 // Color settings
 $theme-color-base-darkest: 'gray-cool-80',
 $theme-color-base-ink: 'gray-cool-90',
 $theme-color-primary: 'red-50',
 $theme-color-secondary: 'yellow-30'
);
```

3. Create main SCSS entry file in `styles/index.scss`:

```scss
@forward 'uswds-theme';
@forward 'uswds';
@use 'uswds-core' as *;
```

4. Import the styles in the root of your application:

```typescript
import './styles/index.scss';
import '@developmentseed/veda-ui/lib/main.css';
// Any other custom styles
import './styles/custom.scss';
```

## Best practices

1. Use USWDS design tokens:

```scss
// Good
.custom-element {
 color: color(gray-90);
 margin: units(2);
}

// Avoid hard coding values
.custom-element {
 color: #e41d3d;
 margin: 16px;
}
```

2. Make use of USWDS mixins and functions:

```scss
.custom-component {
 @include u-padding-x(2);
 @include u-margin-y(1);
 @include typeset('sans', 'sm');
}
```

3. Follow [USWDS custom theme guidelines](https://designsystem.digital.gov/documentation/settings/) to keep the theming consistent.

## Troubleshooting

Common issues and solutions:

1. SASS module resolution issues:
  - Make sure that USWDS paths are correctly configured in your build system

2. Style precedence problems:
  - Make sure the import order is correct in your main SCSS file
  - Check specificity of custom styles

3. Missing USWDS assets, such as the icons?
  - Confirm theme-image-path and theme-font-path are correctly set

## Additional resources

- [USWDS design tokens documentation](https://designsystem.digital.gov/design-tokens/)
- [USWDS settings and theme configuration](https://designsystem.digital.gov/documentation/settings/)
- [USWDS utilities](https://designsystem.digital.gov/utilities/)
- [USWDS layout grid](https://designsystem.digital.gov/utilities/layout-grid/)
- [SASS guidelines](https://sass-lang.com/guidelines/)