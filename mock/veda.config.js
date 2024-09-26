const dotEnvConfig = require('dotenv').config();
const { parsed: config } = dotEnvConfig;
function checkEnvFlag(value) {
  return (value ?? '').toLowerCase() === 'true';
}

let mainNavItems = [
  {
    title: 'Test',
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
    title: checkEnvFlag(config.FEATURE_NEW_EXPLORATION)
      ? 'Exploration'
      : 'Analysis',
    to: checkEnvFlag(config.FEATURE_NEW_EXPLORATION)
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

if (!!config.HUB_URL && !!config.HUB_NAME)
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

if (config.GOOGLE_FORM) {
  subNavItems = [
    ...subNavItems,
    {
      title: 'Contact us',
      src: config.GOOGLE_FORM,
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
  },
cookieConsentForm:{
  title: 'Cookie Consent',
  copy: 'We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our [Privacy Policy](https://www.nasa.gov/privacy/#cookies)'
}
};
