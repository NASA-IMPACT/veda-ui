import { PageHero } from '$components/common/page-hero';
import { GlobalStyles as LegacyGlobalStyles } from '$styles/legacy-global-styles';

// Include only the custom stylings for the VEDA components into the library build
import '$styles/veda-components.scss';

// Adding .last property to array
/* eslint-disable-next-line fp/no-mutating-methods */
Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[this.length - 1];
  },
  set: undefined
});

export * from './atoms';
export * from './enum';
export * from './hooks';
export * from './mdx-components';
export * from './page-components';
export * from './types';
export * from './uswds-components';

export {
  PageHero,
  // STYLE
  LegacyGlobalStyles
};
