module.exports = {
  datasets: './datasets/*.data.mdx',
  stories: './stories/*.stories.mdx',

  pageOverrides: {
    aboutContent: './about.mdx',
    'sandbox-override': './sandbox-override.mdx',

    '/disclaimer': './custom-pages/disclaimer.mdx',
    '/custom-page': './custom-pages/custom.mdx',
    '/aparam/:id': './custom-pages/aparam.mdx'
  },

  strings: {
    stories: {
      one: 'Story',
      other: 'Stories'
    }
  },
  banner: {
    text: 'Read the new data insight on using EMIT and AVIRIS-3 for monitoring large methane emission events.',
    url: 'stories/emit-and-aviris-3',
    expires: '2024-08-03T12:00:00-04:00',
    type: 'info'
  }
};
