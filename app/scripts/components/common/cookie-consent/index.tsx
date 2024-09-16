import React, { useState, useEffect, useMemo } from 'react';

import { Icon } from '@trussworks/react-uswds';
import {
  USWDSAlert,
  USWDSButton,
  USWDSButtonGroup,
  USWDSLink
} from '$components/common/uswds';

import './index.scss';

interface CookieConsentProps {
  title: string;
  copy: string;
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

  const renderContent = useMemo(() => {
    const bracketsParenthRegex = /\[(.*?)\)/;
    const interiroBracketsRegex = /\]\(/;

    const parts = copy.split(bracketsParenthRegex);

    const updatedContent = parts.map((item, key) => {
      if (interiroBracketsRegex.test(item)) {
        const linkParts = item.split(interiroBracketsRegex);

        const newItem = (
          /* eslint-disable react/no-array-index-key */

          <USWDSLink key={key} href={linkParts[1]} target='_blank'>
            {linkParts[0]}
          </USWDSLink>
        );
        /* eslint-enable react/no-array-index-key */

        return newItem;
      }
      return item;
    });
    return updatedContent;
  }, [copy]);

  useEffect(() => {
    // if (readCookie('CookieConsent') ) {
    //   console.log('document.cookie[CookieConsent]', readCookie('CookieConsent'))
    const cookieValue = {
      responded: cookieConsentResponded,
      answer: cookieConsentAnswer
    };

    setCookie(cookieValue, closeConsent);
    onFormInteraction();
    // }
  }, [cookieConsentResponded, cookieConsentAnswer]);

  return (
    <div
      id='cookie-consent'
      className={`margin-2 shadow-2 ${
        cookieConsentResponded || closeConsent ? 'hide-modal' : ''
      }`}
    >
      <USWDSAlert
        type='info'
        heading={title && title}
        headingLevel='h1'
        noIcon={true}
        className='radius-lg'
      >
        <USWDSButton
          type='button'
          className='usa-modal__close close'
          onClick={() => {
            setCloseConsent(true);
          }}
        >
          <Icon.Close />
        </USWDSButton>

        {copy && renderContent}
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
    </div>
  );
};
