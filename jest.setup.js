jest.mock('@mdx-js/react', () => ({
  MDXProvider: () => null
}));
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => children,
  useHref: () => null
}));
jest.mock('veda', () => ({
  getString: (variable) => ({
    one: variable,
    other: variable
  }),
  getNavItemsFromVedaConfig: () => []
}));
export default undefined;
