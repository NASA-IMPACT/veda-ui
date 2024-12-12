import React, {
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useState
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDeepCompareEffect } from 'use-deep-compare';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';
import { getBannerFromVedaConfig, getCookieConsentFromVedaConfig } from 'veda';

import MetaTags from '../meta-tags';
import PageFooter from '../page-footer';
import PageFooterLegacy from '../page-footer-legacy';
import NasaLogoColor from '../nasa-logo-color';

const Banner = React.lazy(() => import('../banner'));
const CookieConsent = React.lazy(() => import('../cookie-consent'));

import { LayoutRootContext } from './context';

import { setGoogleTagManager } from '$utils/use-google-tag-manager';

import NavWrapper from '$components/common/nav-wrapper';
import Logo from '$components/common/page-header-legacy/logo';
import {
  mainNavItems,
  subNavItems,
  footerSettings,
  footerPrimaryContactItems,
  footerPrimaryNavItems
} from '$components/common/page-header/default-config';
import { checkEnvFlag } from '$utils/utils';

const appTitle = process.env.APP_TITLE;
const appDescription = process.env.APP_DESCRIPTION;
const isUSWDSEnabled = checkEnvFlag(process.env.ENABLE_USWDS_PAGE_FOOTER);

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
  const bannerContent = getBannerFromVedaConfig();
  const { children } = props;
  const [displayCookieConsentForm, setDisplayCookieConsentForm] =
    useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    // When there is no cookie consent form set up
    !cookieConsentContent && setGoogleTagManager();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once, and not during SSR

  const { title, thumbnail, description, hideFooter } =
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
      {bannerContent && (
        <Banner appTitle={bannerContent.title} {...bannerContent} />
      )}
      <NavWrapper
        mainNavItems={mainNavItems}
        subNavItems={subNavItems}
        logo={
          <Logo
            linkProperties={{ LinkElement: Link, pathAttributeKeyName: 'to' }}
          />
        }
      />
      <PageBody id={PAGE_BODY_ID} tabIndex={-1}>
        <Outlet />
        {children}
        {cookieConsentContent && displayCookieConsentForm && (
          <CookieConsent
            {...cookieConsentContent}
            setDisplayCookieConsentForm={setDisplayCookieConsentForm}
            setGoogleTagManager={setGoogleTagManager}
            pathname={pathname}
          />
        )}
      </PageBody>
      {isUSWDSEnabled ? (
        <PageFooter
          settings={footerSettings}
          primarySection={{
            footerPrimaryContactItems,
            footerPrimaryNavItems,
            mainNavItems,
            subNavItems
          }}
          hideFooter={hideFooter}
          logoSvg={<NasaLogoColor />}
        />
      ) : (
        <PageFooterLegacy hideFooter={hideFooter} />
      )}
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
