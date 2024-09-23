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

  const renderContent = useMemo(() => {
    const bracketsParenthRegex = /\[(.*?)\)/;
    const interiroBracketsRegex = /\]\(/;

      const parts = copy && copy.split(bracketsParenthRegex);

    const updatedContent = parts && parts.map((item, key) => {
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
    const cookieValue = {
      responded: cookieConsentResponded,
      answer: cookieConsentAnswer
    };

    setCookie(cookieValue, closeConsent);
    onFormInteraction();
  }, [cookieConsentResponded, cookieConsentAnswer, closeConsent]);

  
    if (closeConsent) return null;
    else return (<div
      id='cookie-consent'
      className={`margin-0 tablet:margin-2 shadow-2 position-fixed z-top maxw-full tablet:maxw-tablet-lg bottom-0 right-0 ${
        (cookieConsentResponded || closeConsent) ? 'animation--fade-out' : ''
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
    </div>);
};
