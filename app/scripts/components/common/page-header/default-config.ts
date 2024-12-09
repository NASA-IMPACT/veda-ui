import {
  getString,
  getNavItemsFromVedaConfig,
  getFooterItemsFromVedaConfig
} from 'veda';
import {
  InternalNavLink,
  ExternalNavLink,
  ModalNavLink,
  DropdownNavLink,
  NavItemType
} from '$components/common/page-header/types';

import {
  STORIES_PATH,
  DATASETS_PATH,
  EXPLORATION_PATH,
  ABOUT_PATH
} from '$utils/routes';

let defaultMainNavItems: (
  | ExternalNavLink
  | InternalNavLink
  | DropdownNavLink
  | ModalNavLink
)[] = [
  {
    title: 'Data Catalog',
    to: DATASETS_PATH,
    type: NavItemType.INTERNAL_LINK
  },
  {
    title: 'Exploration',
    to: EXPLORATION_PATH,
    type: NavItemType.INTERNAL_LINK
  },
  {
    title: getString('stories').other,
    to: STORIES_PATH,
    type: NavItemType.INTERNAL_LINK
  }
];

if (!!process.env.HUB_URL && !!process.env.HUB_NAME)
  defaultMainNavItems = [
    ...defaultMainNavItems,
    {
      title: process.env.HUB_NAME,
      href: process.env.HUB_URL,
      type: NavItemType.EXTERNAL_LINK
    } as ExternalNavLink
  ];

let defaultSubNavItems: (
  | ExternalNavLink
  | InternalNavLink
  | DropdownNavLink
  | ModalNavLink
)[] = [
  {
    title: 'About',
    to: ABOUT_PATH,
    type: NavItemType.INTERNAL_LINK
  }
];

if (process.env.GOOGLE_FORM) {
  defaultSubNavItems = [
    ...defaultSubNavItems,
    {
      title: 'Contact us',
      src: process.env.GOOGLE_FORM,
      type: NavItemType.MODAL
    }
  ];
}

const defaultFooterSettings = {
  secondarySection: {
    title: 'email test',
    to: '/data-catalog',
    type: 'Email'
  },
  returnToTop: true
};

const defaultFooterPrimaryContactItems = [
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

const defaultFooterPrimaryNavItems = [
  {
    title: 'Stories',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: 'Topics',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    title: 'Data Toolkit',
    to: '/data-catalog',
    type: 'internalLink'
  }
];

const mainNavItems =
  getNavItemsFromVedaConfig()?.mainNavItems ?? defaultMainNavItems;
const subNavItems =
  getNavItemsFromVedaConfig()?.subNavItems ?? defaultSubNavItems;
const footerSettings =
  getFooterItemsFromVedaConfig()?.footerSettings ?? defaultFooterSettings;
const footerPrimaryContactItems =
  getFooterItemsFromVedaConfig()?.footerPrimaryContactItems ??
  defaultFooterPrimaryContactItems;
const footerPrimaryNavItems =
  getFooterItemsFromVedaConfig()?.footerPrimaryNavItems ??
  defaultFooterPrimaryNavItems;

export {
  mainNavItems,
  subNavItems,
  footerSettings,
  footerPrimaryContactItems,
  footerPrimaryNavItems
};
