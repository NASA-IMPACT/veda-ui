import React, { ReactNode, useContext, useCallback } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';
import { getString, getNavItemsFromVedaConfig } from 'veda';
import MetaTags from '../meta-tags';
import PageFooter from '../page-footer';
import Banner from '../banner';
import { LayoutRootContext } from './context';

import { useGoogleTagManager } from '$utils/use-google-tag-manager';

import NavWrapper from '$components/common/nav-wrapper';
import { InternalNavLink, ExternalNavLink, ModalNavLink, DropdownNavLink } from '$components/common/page-header';

import { checkEnvFlag } from '$utils/utils';
import {
  STORIES_PATH,
  DATASETS_PATH,
  ANALYSIS_PATH,
  EXPLORATION_PATH,
  ABOUT_PATH
} from '$utils/routes';

const appTitle = process.env.APP_TITLE;
const appDescription = process.env.APP_DESCRIPTION;

export const PAGE_BODY_ID = 'pagebody';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-anchor: none;
`;

const PageBody = styled.div`
  flex-grow: 1;
  animation: ${reveal} 0.48s ease 0s 1;
  display: flex;
  flex-direction: column;
  overflow-anchor: auto;
`;


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

const navItems = getNavItemsFromVedaConfig()?.mainNavItems?? defaultMainNavItems;
const subNavItems = getNavItemsFromVedaConfig()?.subNavItems?? defaultSubNavItems;

function LayoutRoot(props: { children?: ReactNode }) {
  const { children } = props;

  useGoogleTagManager();

  const { title, thumbnail, description, banner, hideFooter } =
    useContext(LayoutRootContext);

  const truncatedTitle =
    title?.length > 32 ? `${title.slice(0, 32)}...` : title;

  const fullTitle = truncatedTitle ? `${truncatedTitle} — ` : '';
  return (
    <Page>
      <MetaTags
        title={`${fullTitle}${appTitle}`}
        description={description || appDescription}
        thumbnail={thumbnail}
      />
      {banner && <Banner appTitle={title} {...banner} />}
      <NavWrapper mainNavItems={navItems} subNavItems={subNavItems} />
      <PageBody id={PAGE_BODY_ID} tabIndex={-1}>
        <Outlet />
        {children}
      </PageBody>
      <PageFooter isHidden={hideFooter} />
    </Page>
  );
}

export default LayoutRoot;

export function LayoutProps(props) {
  const { setLayoutProps } = useContext(LayoutRootContext);

  useDeepCompareEffect(() => {
    setLayoutProps(props);
  }, [setLayoutProps, props]);

  return null;
}

/**
 * Hook to access the feedback modal.
 */
export function useFeedbackModal() {
  const { feedbackModalRevealed, setFeedbackModalRevealed } =
    useContext(LayoutRootContext);

  return {
    isRevealed: feedbackModalRevealed,
    show: useCallback(
      () => setFeedbackModalRevealed(true),
      [setFeedbackModalRevealed]
    ),
    hide: useCallback(
      () => setFeedbackModalRevealed(false),
      [setFeedbackModalRevealed]
    )
  };
}
