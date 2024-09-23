import React, { useState, useEffect } from 'react';
import { Icon } from '@trussworks/react-uswds';
import {
  USWDSAlert,
  USWDSButton,
  USWDSButtonGroup
} from '$components/common/uswds';

import './index.scss';

interface CookieConsentProps {
  title?: string | undefined;
  copy?: string | undefined;
  onFormInteraction: () => void;
}

export const CookieConsent = ({
  title,
  copy,
  onFormInteraction
}: CookieConsentProps) => {
  const [cookieConsentResponded, SetCookieConsentResponded] =
    useState<boolean>(false);
  const [cookieConsentAnswer, SetCookieConsentAnswer] =
    useState<boolean>(false);
  const [closeConsent, setCloseConsent] = useState<boolean>(false);
  //Setting expiration date for cookie to expire and re-ask user for consent.
  const setCookieExpiration = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 3);
    return today.toUTCString();
  };

  const setCookie = (cookieValue, closeConsent) => {
    document.cookie = `CookieConsent=${JSON.stringify(
      cookieValue
    )}; path=/; expires=${closeConsent ? '0' : setCookieExpiration()}`;
  };

  const addAttribute = copy && copy?.replaceAll('<a', `<a target="_blank" rel="noopener" role="link"`);
  useEffect(() => {
    const cookieValue = {
      responded: cookieConsentResponded,
      answer: cookieConsentAnswer
    };
    setCookie(cookieValue, closeConsent);
    onFormInteraction();

  }, [cookieConsentResponded, cookieConsentAnswer, closeConsent]);

    return (<div
      id='cookie-consent'
      className={`margin-0 tablet:margin-2 shadow-2 position-fixed z-top maxw-full tablet:maxw-tablet-lg animation--fade-out right-0 bottom-0 ${
        (cookieConsentResponded || closeConsent) ? ' opacity-0' : 'opacity-1'

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

        {addAttribute && <div dangerouslySetInnerHTML={{ __html: addAttribute }} />}
        <USWDSButtonGroup className='padding-top-2'>
          <USWDSButton
            onClick={() => {
              SetCookieConsentResponded(true);
              SetCookieConsentAnswer(false);
            }}
            outline={true}
            type='button'
          >
            Decline Cookies
          </USWDSButton>
          <USWDSButton
            onClick={() => {
              SetCookieConsentResponded(true);
              SetCookieConsentAnswer(true);
            }}
            type='button'
          >
            Accept Cookies
          </USWDSButton>
        </USWDSButtonGroup>
      </USWDSAlert>
    </div>);
};
