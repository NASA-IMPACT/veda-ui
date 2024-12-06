const dotEnvConfig = require('dotenv').config();
const { parsed: config } = dotEnvConfig;
function checkEnvFlag(value) {
  return (value ?? '').toLowerCase() === 'true';
}

let mainNavItems = [
  {
    id: 'test',
    title: 'Test',
    type: 'dropdown',
    children: [
      {
        id: 'dropdown-menu-item-1',
        title: 'dropdown menu item 1',
        to: '/stories',
        type: 'internalLink'
      }
    ]
  },
  {
    id: 'another-test',
    title: 'Another Test',
    type: 'dropdown',
    children: [
      {
        id: 'dropdown-menu-item-2',
        title: 'dropdown menu item 2',
        to: '/stories',
        type: 'internalLink'
      }
    ]
  },
  {
    id: 'data-catalog',
    title: 'Data Catalog',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    id: 'exploration',
    title: 'Exploration',
    to: '/exploration',
    type: 'internalLink'
  },
  {
    id: 'stories',
    title: 'Stories',
    to: '/stories',
    type: 'internalLink'
  }
];

if (!!config.HUB_URL && !!config.HUB_NAME)
  mainNavItems = [
    ...mainNavItems,
    {
      id: 'hub',
      title: process.env.HUB_NAME,
      href: process.env.HUB_URL,
      type: 'externalLink'
    }
  ];

let subNavItems = [
  {
    id: 'about',
    title: 'About',
    to: '/about',
    type: 'internalLink'
  }
];

if (config.GOOGLE_FORM) {
  subNavItems = [
    ...subNavItems,
    {
      id: 'contact-us',
      title: 'Contact us',
      actionId: 'open-google-form',
      type: 'action'
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
