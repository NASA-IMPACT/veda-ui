import { getString, getNavItemsFromVedaConfig } from 'veda';
import {
  InternalNavLink,
  ExternalNavLink,
  DropdownNavLink,
  NavItemType,
  ActionNavItem
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

if (process.env.GOOGLE_FORM !== undefined) {
  if (process.env.ENABLE_USWDS_PAGE_HEADER) {
    defaultSubNavItems = [
      ...defaultSubNavItems,
      {
        id: 'contact-us',
        title: 'Contact us',
        actionId: 'open-google-form',
        type: NavItemType.ACTION
      }
    ];
  } else {
    defaultSubNavItems = [
      ...defaultSubNavItems,
      {
        id: 'contact-us',
        title: 'Contact us',
        actionId: 'open-google-form',
        src: process.env.GOOGLE_FORM,
        type: NavItemType.ACTION
      }
    ];
  }
}

const mainNavItems =
  getNavItemsFromVedaConfig()?.mainNavItems ?? defaultMainNavItems;
const subNavItems =
  getNavItemsFromVedaConfig()?.subNavItems ?? defaultSubNavItems;

export { mainNavItems, subNavItems };
