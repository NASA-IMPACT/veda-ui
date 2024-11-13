import { getString, getNavItemsFromVedaConfig } from 'veda';
import {
  InternalNavLink,
  ExternalNavLink,
  ButtonNavItem,
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
  | ButtonNavItem
  | ActionNavItem
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
  | ButtonNavItem
  | ActionNavItem
)[] = [
  {
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
        title: 'Contact us',
        actionId: 'open-google-form',
        type: NavItemType.ACTION
      }
    ];
  } else {
    defaultSubNavItems = [
      ...defaultSubNavItems,
      {
        title: 'Contact us',
        actionId: 'open-google-form',
        src: process.env.GOOGLE_FORM,
        type: NavItemType.BUTTON
      }
    ];
  }
}

const mainNavItems =
  getNavItemsFromVedaConfig()?.mainNavItems ?? defaultMainNavItems;
const subNavItems =
  getNavItemsFromVedaConfig()?.subNavItems ?? defaultSubNavItems;

export { mainNavItems, subNavItems };
