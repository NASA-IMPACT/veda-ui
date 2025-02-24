import {
  getNavItemsFromVedaConfig,
  getFooterSettingsFromVedaConfig
} from 'veda';
import { InternalNavLink, ExternalNavLink } from '../types';
import {
  aboutNavItem,
  contactUsNavItem,
  dataCatalogNavItem,
  explorationNavItem,
  storiesNavItem
} from '../page-header/default-config';
import {
  ActionNavItem,
  DropdownNavLink
} from '$components/common/page-header/types';

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

export const defaultMainNavItems: (
  | ExternalNavLink
  | InternalNavLink
  | DropdownNavLink
  | ActionNavItem
)[] = [
  {
    ...dataCatalogNavItem,
    customClassNames: 'usa-footer__primary-link'
  },
  {
    ...explorationNavItem,
    customClassNames: 'usa-footer__primary-link'
  },
  {
    ...storiesNavItem,
    customClassNames: 'usa-footer__primary-link'
  }
];

export let defaultSubNavItems: (
  | ExternalNavLink
  | InternalNavLink
  | DropdownNavLink
  | ActionNavItem
)[] = [
  {
    ...aboutNavItem,
    customClassNames: 'usa-link text-base-dark text-underline'
  }
];

if (process.env.GOOGLE_FORM !== undefined) {
  defaultSubNavItems = [
    ...defaultSubNavItems,
    {
      ...contactUsNavItem,
      customClassNames: 'usa-link text-base-dark text-underline'
    }
  ];
}

const footerSettings =
  getFooterSettingsFromVedaConfig() ?? defaultFooterSettings;
const footerNavItems =
  getNavItemsFromVedaConfig()?.footerNavItems ?? defaultMainNavItems;
const footerSubNavItems =
  getNavItemsFromVedaConfig()?.footerSubNavItems ?? defaultSubNavItems;

export { footerSettings, footerNavItems, footerSubNavItems };
