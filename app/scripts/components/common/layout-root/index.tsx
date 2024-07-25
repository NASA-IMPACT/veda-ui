import React, { ReactNode, useContext, useCallback } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';
import { ContentOverride } from '$components/common/page-overrides';
import { getString } from 'veda';
import MetaTags from '../meta-tags';
import PageFooter from '../page-footer';
import Banner from '../banner';
import { LayoutRootContext } from './context';

import { useGoogleTagManager } from '$utils/use-google-tag-manager';

import NavWrapper from '$components/common/nav-wrapper';

import { checkEnvFlag } from '$utils/utils';
import {
  STORIES_PATH,
  DATASETS_PATH,
  ANALYSIS_PATH,
  ABOUT_PATH,
  EXPLORATION_PATH
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



let navItems = [{
  title: 'Data Catalog',
  to: DATASETS_PATH
}, {
  title: checkEnvFlag(process.env.FEATURE_NEW_EXPLORATION) ? 'Exploration' : 'Analysis',
  to: checkEnvFlag(process.env.FEATURE_NEW_EXPLORATION) ? EXPLORATION_PATH : ANALYSIS_PATH,
}, {
  title: getString('stories').other,
  to: STORIES_PATH
}];

if (!!process.env.HUB_URL && !!process.env.HUB_NAME) navItems = [...navItems, {
  title: process.env.HUB_NAME,
  href: process.env.HUB_URL,
  as:'a',
  target:'_blank',
  rel:'noopener'
}];


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
      <NavWrapper />
      <ContentOverride with='nav'>
        <NavWrapper mainNavItems={navItems} />
      </ContentOverride>
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
