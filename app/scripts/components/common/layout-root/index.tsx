import React, { ReactNode, useContext, useCallback } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import styled from 'styled-components';
import { Outlet } from 'react-router';
import { reveal } from '@devseed-ui/animation';
import MetaTags from '../meta-tags';
import PageFooter from '../page-footer';
import Banner from '../banner';
import { LayoutRootContext } from './context';

import { useGoogleTagManager } from '$utils/use-google-tag-manager';

import NavWrapper from '$components/common/nav-wrapper';
import Logo from '$components/common/page-header/logo';
import {
  mainNavItems,
  subNavItems
} from '$components/common/page-header/default-config';
import { CookieConsent } from '../cookie-consent';
import { checkEnvFlag } from '$utils/utils';
import { getCookieConsentFromVedaConfig } from 'veda';

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

  const useConsentForm = checkEnvFlag(process.env.COOKIE_CONSENT_FORM);

  !useConsentForm && useGoogleTagManager();

  const readCookie = (name) => {
    var nameEQ = name + '=';
    var attribute = document.cookie.split(';');
    for (var i = 0; i < attribute.length; i++) {
      var c = attribute[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  const { children } = props;
  let cookieContents;

  const getCookie = () => {
    if (document.cookie != '') {
      const cookie = readCookie('CookieConsent');
      //Need to think through work around for the null warning.
      if (cookie != null) {
        cookieContents = JSON.parse(cookie);
      }
      cookieContents.answer && useGoogleTagManager();

      return cookieContents;
    }
    cookieContents = 'NO COOKIE';
  };

  const cookieConsentContent = getCookieConsentFromVedaConfig()
  const showForm = () => {
    getCookie();

    if (cookieContents === 'NO COOKIE') {
      return true;
    } else {
      return !cookieContents.responded;
    }
  };

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
        logo={<Logo />}
      />
      <PageBody id={PAGE_BODY_ID} tabIndex={-1}>
        <Outlet />
        {children}
        {useConsentForm && showForm() && (
          <CookieConsent
          {...cookieConsentContent}
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
