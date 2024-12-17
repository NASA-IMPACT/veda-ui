import {
  getString,
  getNavItemsFromVedaConfig,
  getFooterSettingsFromVedaConfig
} from 'veda';
import {
  InternalNavLink,
  ExternalNavLink,
  ActionNavItem,
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
  | ActionNavItem
)[] = [
  {
    id: 'data-catalog',

    title: 'Data Catalog',
    to: DATASETS_PATH,
    type: NavItemType.INTERNAL_LINK
  },
  {
    id: 'exploration',
    title: 'Exploration',
    to: EXPLORATION_PATH,
    type: NavItemType.INTERNAL_LINK
  },
  {
    id: 'stories',
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
  | ActionNavItem
)[] = [
  {
    id: 'about',
    title: 'About',
    to: ABOUT_PATH,
    type: NavItemType.INTERNAL_LINK
  }
];

const defaultFooterSettings = {
  secondarySection: {
    division: 'NASA EarthData 2024',
    version: 'BETA VERSION',
    title: 'NASA Official',
    name: 'Manil Maskey',
    to: 'test@example.com',
    type: 'email'
  },
  returnToTop: true
};

if (process.env.GOOGLE_FORM !== undefined) {
  defaultSubNavItems = [
    ...defaultSubNavItems,
    {
      id: 'contact-us',
      title: 'Contact us',
      actionId: 'open-google-form',
      type: NavItemType.ACTION
    }
  ];
}

const mainNavItems =
  getNavItemsFromVedaConfig()?.mainNavItems ?? defaultMainNavItems;
const subNavItems =
  getNavItemsFromVedaConfig()?.subNavItems ?? defaultSubNavItems;
const footerSettings =
  getFooterSettingsFromVedaConfig() ?? defaultFooterSettings;

export { mainNavItems, subNavItems, footerSettings };
