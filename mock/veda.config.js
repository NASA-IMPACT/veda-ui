const dotEnvConfig = require('dotenv').config();
const { parsed: config } = dotEnvConfig;

const dataCatalogNavItem = {
  id: 'data-catalog',
  title: 'Data Catalog',
  to: '/data-catalog',
  type: 'internalLink'
};

const explorationNavItem = {
  id: 'exploration',
  title: 'Exploration',
  to: '/exploration',
  type: 'internalLink'
};

const storiesNavItem = {
  id: 'stories',
  title: 'Stories',
  to: '/stories',
  type: 'internalLink'
};

const aboutNavItem = {
  id: 'about',
  title: 'About',
  to: '/about',
  type: 'internalLink'
};

const contactUsNavItem = {
  id: 'contact-us',
  title: 'Contact us',
  actionId: 'open-google-form',
  type: 'action'
};

let headerNavItems = [
  {
    id: 'test',
    title: 'TestDropdown1',
    type: 'dropdown',
    children: [
      {
        id: 'dropdown-menu-item-1',
        title: 'route to stories',
        to: '/stories',
        type: 'internalLink'
      }
    ]
  },
  {
    id: 'another-test',
    title: 'TestDropdown2',
    type: 'dropdown',
    children: [
      {
        id: 'dropdown-menu-item-2',
        title: 'route to about',
        to: '/about',
        type: 'internalLink'
      }
    ]
  },
  dataCatalogNavItem,
  explorationNavItem,
  storiesNavItem
];

let footerNavItems = [
  {
    ...dataCatalogNavItem,
    customClassNames:
      'usa-footer__primary-link tablet:padding-0 padding-x-0 padding-y-4'
  },
  {
    ...explorationNavItem,
    customClassNames:
      'usa-footer__primary-link tablet:padding-0 padding-x-0 padding-y-4'
  },
  {
    ...storiesNavItem,
    customClassNames:
      'usa-footer__primary-link tablet:padding-0 padding-x-0 padding-y-4'
  }
];

let footerSettings = {
  secondarySection: {
    division: 'NASA EarthData 2024',
    version: process.env.APP_VERSION ?? 'BETA VERSION',
    title: 'NASA Official',
    name: 'Manil Maskey',
    to: 'test@example.com',
    type: 'email'
  },
  returnToTop: true
};

if (!!config.HUB_URL && !!config.HUB_NAME)
  headerNavItems = [
    ...headerNavItems,
    {
      id: 'hub',
      title: process.env.HUB_NAME,
      href: process.env.HUB_URL,
      type: 'externalLink'
    }
  ];

let subNavItems = [aboutNavItem];

let footerSubNavItems = [
  {
    ...aboutNavItem,
    customClassNames: 'usa-link text-base-dark text-underline'
  }
];

const defaultGuidance = {
  left: {
    title: 'Official websites use .gov',
    text: 'A **.gov** website belongs to an official government organization in the United States.',
    iconAlt: 'Dot gov icon',
    icon: '/img/icon-dot-gov.svg'
  },
  right: {
    title: 'Secure .gov websites use HTTPS',
    text: "A **lock icon** or **https://** means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.",
    iconAlt: 'HTTPS icon',
    icon: '/img/icon-https.svg'
  }
};

if (config.GOOGLE_FORM) {
  footerSubNavItems = [
    ...footerSubNavItems,
    {
      ...contactUsNavItem,
      customClassNames: 'usa-link text-base-dark text-underline'
    }
  ];
  subNavItems = [...subNavItems, contactUsNavItem];
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
    headerText: 'An official website of the United States government',
    headerActionText: "Here's how you know",
    ariaLabel: 'Banner for official government website',
    flagImgSrc: '/img/us_flag_small.png',
    flagImgAlt: 'US flag',
    leftGuidance: defaultGuidance.left,
    rightGuidance: defaultGuidance.right,
    className: '',
    defaultIsOpen: false,
    contentId: 'gov-banner-content'
  },
  siteAlert: {
    content: `[Discover insights on how the COVID-19 pandemic](stories/life-of-water) impacted air quality worldwide, observed through NASA's satellite data.`,
    expires: '2026-08-03T12:00:00-04:00',
    type: 'info',
    slim: true,
    showIcon: true
  },
  navItems: {
    headerNavItems,
    footerNavItems,
    subNavItems,
    footerSubNavItems
  },

  footerSettings,
  cookieConsentForm: {
    title: 'Cookie Consent',
    copy: 'We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our [Privacy Policy](https://www.nasa.gov/privacy/#cookies)',
    theme: {
      card: {
        backgroundColor: '#E7F6F8',
        sideBarColor: '#005EA2',
        textColor: 'Black',
        linkColor: '#005EA2'
      },
      acceptButton: {
        default: { backgroundColor: '#005EA2', textColor: 'white' },
        hover: { backgroundColor: '#2c3e50', textColor: '#white' }
      },
      declineButton: {
        default: { borderColor: '#005EA2', textColor: '#005EA2' },
        hover: { borderColor: '#2c3e50', textColor: '#2c3e50' }
      },
      iconColor: { default: 'White', hover: '#175074' }
    }
  }
};
