import { getString, getNavItemsFromVedaConfig } from 'veda';
import { InternalNavLink, ExternalNavLink } from '../types';

import {
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

export const dataCatalogNavItem: InternalNavLink = {
  id: 'data-catalog',
  title: 'Data Catalog',
  to: DATASETS_PATH,
  type: NavItemType.INTERNAL_LINK
};

export const explorationNavItem: InternalNavLink = {
  id: 'exploration',
  title: 'Exploration',
  to: EXPLORATION_PATH,
  type: NavItemType.INTERNAL_LINK
};

export const storiesNavItem: InternalNavLink = {
  id: 'stories',
  title: getString('stories').other,
  to: STORIES_PATH,
  type: NavItemType.INTERNAL_LINK
};

export const aboutNavItem: InternalNavLink = {
  id: 'about',
  title: 'About',
  to: ABOUT_PATH,
  type: NavItemType.INTERNAL_LINK
};

export const contactUsNavItem: ActionNavItem = {
  id: 'contact-us',
  title: 'Contact us',
  actionId: 'open-google-form',
  type: NavItemType.ACTION
};

export let defaultMainNavItems: (
  | ExternalNavLink
  | InternalNavLink
  | DropdownNavLink
  | ActionNavItem
)[] = [dataCatalogNavItem, explorationNavItem, storiesNavItem];

if (!!process.env.HUB_URL && !!process.env.HUB_NAME)
  defaultMainNavItems = [
    ...defaultMainNavItems,
    {
      title: process.env.HUB_NAME,
      href: process.env.HUB_URL,
      type: NavItemType.EXTERNAL_LINK
    } as ExternalNavLink
  ];

export let defaultSubNavItems: (
  | ExternalNavLink
  | InternalNavLink
  | DropdownNavLink
  | ActionNavItem
)[] = [aboutNavItem];

if (process.env.GOOGLE_FORM !== undefined) {
  defaultSubNavItems = [...defaultSubNavItems, contactUsNavItem];
}

const mainNavItems =
  getNavItemsFromVedaConfig()?.mainNavItems ?? defaultMainNavItems;
const subNavItems =
  getNavItemsFromVedaConfig()?.subNavItems ?? defaultSubNavItems;

export { mainNavItems, subNavItems };
