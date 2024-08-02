import { getString, getNavItemsFromVedaConfig } from 'veda';
import { InternalNavLink, ExternalNavLink, ModalNavLink, DropdownNavLink } from '$components/common/page-header/types';

import { checkEnvFlag } from '$utils/utils';
import {
  STORIES_PATH,
  DATASETS_PATH,
  ANALYSIS_PATH,
  EXPLORATION_PATH,
  ABOUT_PATH
} from '$utils/routes';

let defaultMainNavItems:(ExternalNavLink | InternalNavLink | DropdownNavLink | ModalNavLink)[] = [{
  title: 'Data Catalog',
  to: DATASETS_PATH,
  type: 'internalLink'
}, {
  title: checkEnvFlag(process.env.FEATURE_NEW_EXPLORATION) ? 'Exploration' : 'Analysis',
  to: checkEnvFlag(process.env.FEATURE_NEW_EXPLORATION) ? EXPLORATION_PATH : ANALYSIS_PATH,
  type: 'internalLink'
}, {
  title: getString('stories').other,
  to: STORIES_PATH,
  type: 'internalLink'
}];

if (!!process.env.HUB_URL && !!process.env.HUB_NAME) defaultMainNavItems = [...defaultMainNavItems, {
  title: process.env.HUB_NAME,
  href: process.env.HUB_URL,
  type: 'externalLink'
} as ExternalNavLink];

let defaultSubNavItems:(ExternalNavLink | InternalNavLink | DropdownNavLink | ModalNavLink)[] = [{
  title: 'About',
  to: ABOUT_PATH,
  type: 'internalLink'
}];

if (process.env.GOOGLE_FORM) {
  defaultSubNavItems = [...defaultSubNavItems, {
    title: 'Contact us',
    src: process.env.GOOGLE_FORM,
    type: 'modal'
  }];
}

const mainNavItems = getNavItemsFromVedaConfig()?.mainNavItems?? defaultMainNavItems;
const subNavItems = getNavItemsFromVedaConfig()?.subNavItems?? defaultSubNavItems;

export {
  mainNavItems,
  subNavItems
};