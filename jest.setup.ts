import '@testing-library/jest-dom';

jest.mock('@mdx-js/react', () => ({
  MDXProvider: () => null
}));
jest.mock('veda', () => ({
  getString: (variable) => ({
    one: variable,
    other: variable
  }),
  getNavItemsFromVedaConfig: () => [],
  getFooterSettingsFromVedaConfig: () => []
}));

export default undefined;
