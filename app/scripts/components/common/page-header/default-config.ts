import { getString, getNavItemsFromVedaConfig } from 'veda';
import {
  InternalNavLink,
  ExternalNavLink,
  ButtonNavLink,
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
  | ButtonNavLink
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
  | ButtonNavLink
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
      type: NavItemType.BUTTON
    }
  ];
}

const mainNavItems =
  getNavItemsFromVedaConfig()?.mainNavItems ?? defaultMainNavItems;
const subNavItems =
  getNavItemsFromVedaConfig()?.subNavItems ?? defaultSubNavItems;

export { mainNavItems, subNavItems };
