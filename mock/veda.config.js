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
    title: 'Exploration',
    to: '/exploration',
    type: 'internalLink'
  },
  {
    title: 'stories',
    to: '/stories',
    type: 'internalLink'
  }
];
let footerPrimaryNavItems = [
  {
    title: 'Data Catalog',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: 'Data Catalog 2',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: 'Data Catalog3',
    to: '/data-catalog',
    type: 'internalLink'
  }
];
let footerPrimaryContactItems = [
  {
    title: 'News and Events',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: 'About',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: 'Contact Us',
    to: '/data-catalog',
    type: 'internalLink'
  }
];

let footerSettings = {
  secondarySection: {
    title: 'email test',
    to: '/data-catalog',
    type: 'Email'
  },
  returnToTop: true
};

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
  footerItems: {
    footerSettings,
    footerPrimaryContactItems,
    footerPrimaryNavItems
  },
  cookieConsentForm: {
    title: 'Cookie Consent',
    copy: 'We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our [Privacy Policy](https://www.nasa.gov/privacy/#cookies)',
    theme: {
      card: {
        backgroundColor: '#2276ac',
        sideBarColor: '#175074',
        textColor: 'White',
        linkColor: '#175074'
      },
      acceptButton: {
        default: { backgroundColor: '#175074', textColor: 'white' },
        hover: { backgroundColor: '#2c3e50', textColor: '#white' }
      },
      declineButton: {
        default: { borderColor: '#175074', textColor: '#175074' },
        hover: { borderColor: '#2c3e50', textColor: '#2c3e50' }
      },
      iconColor: { default: 'White', hover: '#175074' }
    }
  }
};
