function checkEnvFlag(value) {
  return (value ?? '').toLowerCase() === 'true';
}

let mainNavItems = [
  {
    title: 'test',
    type: 'dropdown',
    children: [
      {
        title: 'test dropdown',
        to: '/stories',
        type: 'internalLink'
      }
    ]
  },
  {
    title: 'Data Catalog',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: checkEnvFlag(process.env.FEATURE_NEW_EXPLORATION)
      ? 'Exploration'
      : 'Analysis',
    to: checkEnvFlag(process.env.FEATURE_NEW_EXPLORATION)
      ? '/exploration'
      : '/analysis',
    type: 'internalLink'
  },
  {
    title: 'stories',
    to: '/stories',
    type: 'internalLink'
  }
];

if (!!process.env.HUB_URL && !!process.env.HUB_NAME)
  mainNavItems = [
    ...mainNavItems,
    {
      title: process.env.HUB_NAME,
      href: process.env.HUB_URL,
      type: 'externalLink'
    }
  ];

let subNavItems = [
  {
    title: 'About',
    to: '/about',
    type: 'internalLink'
  }
];

if (process.env.GOOGLE_FORM) {
  subNavItems = [
    ...subNavItems,
    {
      title: 'Contact us',
      src: process.env.GOOGLE_FORM,
      type: 'modal'
    }
  ];
}

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
  },
  navItems: {
    mainNavItems,
    subNavItems
  }
};
