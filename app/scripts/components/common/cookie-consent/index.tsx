import React, { useState, useEffect } from 'react';
import { Icon } from '@trussworks/react-uswds';

import { setCookie, getCookie } from './utils';
import {
  USWDSAlert,
  USWDSButton,
  USWDSButtonGroup
} from '$components/common/uswds';

import './index.scss';

interface CookieConsentProps {
  title?: string | undefined;
  copy?: string | undefined;
  pathname: string;
  setDisplayCookieConsentForm: (boolean) => void;
  setGoogleTagManager: () => void;
}

function addAttribute(copy) {
  return copy.replaceAll('<a', `<a target="_blank" rel="noopener" role="link"`);
}

export const CookieConsent = ({
  title,
  copy,
  pathname,
  setDisplayCookieConsentForm,
  setGoogleTagManager
}: CookieConsentProps) => {
  const [cookieConsentResponded, setCookieConsentResponded] =
    useState<boolean>(false);
  const [cookieConsentAnswer, setCookieConsentAnswer] =
    useState<boolean>(false);
  const [closeConsent, setCloseConsent] = useState<boolean>(false);

  useEffect(() => {
    if (!cookieConsentResponded) {
      const cookieContents = getCookie();
      if (cookieContents) {
        cookieContents.answer && setGoogleTagManager();
        setCookieConsentResponded(cookieContents.responded);
        setCookieConsentAnswer(cookieContents.answer);
        if (!cookieContents.responded) setCloseConsent(false);
      } else {
        setCloseConsent(false);
      }
    }
    // to Rerender on route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    // When not responded, do nothing.
    if (!cookieConsentResponded) return;
    // When answer is accept cookie,
    // 1. set up google manager
    cookieConsentAnswer && setGoogleTagManager();
    // 2. update the cookie value
    const cookieValue = {
      responded: cookieConsentResponded,
      answer: cookieConsentAnswer
    };
    setCookie(cookieValue, closeConsent);
    // 3. Tell the layout that we don't have to render this consent form
    // from the next render of layout.
    setDisplayCookieConsentForm(false);
  }, [
    cookieConsentResponded,
    cookieConsentAnswer,
    closeConsent,
    setDisplayCookieConsentForm,
    setGoogleTagManager
  ]);

  return (
    <div>
      {!cookieConsentResponded && (
        <div
          id='cookie-consent'
          className={`margin-0 tablet:margin-2 shadow-2 position-fixed z-top maxw-full tablet:maxw-tablet-lg animation--fade-out right-0 bottom-0 ${
            closeConsent
              ? ' opacity-0 z-bottom pointer-events--none'
              : 'opacity-1 z-top'
          }`}
        >
          <USWDSAlert
            type='info'
            heading={title && title}
            headingLevel='h2'
            noIcon={true}
            className='radius-lg'
          >
            <USWDSButton
              type='button '
              className='width-3 height-3 padding-0 position-absolute right-2 top-2'
              onClick={() => {
                setCloseConsent(true);
              }}
              unstyled
            >
              <Icon.Close size={3} />
            </USWDSButton>

            {copy && (
              <div dangerouslySetInnerHTML={{ __html: addAttribute(copy) }} />
            )}
            <USWDSButtonGroup className='padding-top-2'>
              <USWDSButton
                onClick={() => {
                  setCookieConsentResponded(true);
                  setCookieConsentAnswer(false);
                }}
                outline={true}
                type='button'
              >
                Decline Cookies
              </USWDSButton>
              <USWDSButton
                onClick={() => {
                  setCookieConsentResponded(true);
                  setCookieConsentAnswer(true);
                }}
                type='button'
              >
                Accept Cookies
              </USWDSButton>
            </USWDSButtonGroup>
          </USWDSAlert>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
