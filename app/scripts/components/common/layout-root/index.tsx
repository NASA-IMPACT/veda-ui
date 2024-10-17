import React, { ReactNode, useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDeepCompareEffect } from 'use-deep-compare';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';
import { getCookieConsentFromVedaConfig } from 'veda';
import MetaTags from '../meta-tags';
import PageFooter from '../page-footer';
import Banner from '../banner';
import { CookieConsent } from '../cookie-consent';

import { LayoutRootContext } from './context';

import { setGoogleTagManager } from '$utils/use-google-tag-manager';

import NavWrapper from '$components/common/nav-wrapper';
import Logo from '$components/common/page-header/logo';
import {
  mainNavItems,
  subNavItems
} from '$components/common/page-header/default-config';

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

function LayoutRoot(props: { children?: ReactNode }) {
  const cookieConsentContent = getCookieConsentFromVedaConfig();

  const { children } = props;

  useEffect(() => {
    // window.sessionStorage.setItem("sessionStart", "true");
    !cookieConsentContent && setGoogleTagManager();
  }, []);

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
      <NavWrapper
        mainNavItems={mainNavItems}
        subNavItems={subNavItems}
        logo={<Logo linkProperties={{LinkElement: Link, pathAttributeKeyName: 'to'}} />}
      />
      <PageBody id={PAGE_BODY_ID} tabIndex={-1}>
        <Outlet />
        {children}
        {cookieConsentContent && (
          <CookieConsent
            {...cookieConsentContent}
            setGoogleTagManager={setGoogleTagManager}
          />
        )}
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
