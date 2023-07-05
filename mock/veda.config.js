module.exports = {
  datasets: './datasets/*.data.mdx',
  discoveries: './discoveries/*.discoveries.mdx',

  taxonomiesIndex: './taxonomies.yml',

  pageOverrides: {
    aboutContent: './about.mdx',
    'sandbox-override': './sandbox-override.mdx',

    '/disclaimer': './custom-pages/disclaimer.mdx',
    '/custom-page': './custom-pages/custom.mdx',
    '/aparam/:id': './custom-pages/aparam.mdx'
  }
};
