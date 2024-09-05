import React, { useState, useEffect } from 'react';

import {
  Alert,
  Button,
  ButtonGroup,
  Link,
  Icon
} from '@trussworks/react-uswds';
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
  const [cookieConsentResponded, SetCookieConsentResponded] = useState(Boolean);
  const [cookieConsentAnswer, SetCookieConsentAnswer] = useState(Boolean);
  const [closeConsent, setCloseConsent] = useState(Boolean);
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

  const renderContent = () => {
    const bracketsParenthRegex = /\[(.*?)\)/;
    const interiroBracketsRegex = /\]\(/;

    const parts = copy.split(bracketsParenthRegex);

    const updatedContent = parts.map((item, key) => {
      if (interiroBracketsRegex.test(item)) {
        const linkParts = item.split(interiroBracketsRegex);

        const newItem = (
          /* eslint-disable react/no-array-index-key */

          <Link key={key} href={linkParts[1]} target='_blank'>
            {linkParts[0]}
          </Link>
        );
        /* eslint-enable react/no-array-index-key */

        return newItem;
      }
      return item;
    });
    return updatedContent;
  };

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
      className={`modal margin-2 shadow-2 ${
        cookieConsentResponded || closeConsent ? 'hide-modal' : ''
      }`}
    >
      <Alert
        type='info'
        heading={title && title}
        headingLevel='h1'
        noIcon={true}
        className='radius-lg'
      >
        <Button
          type='button'
          className='usa-modal__close close'
          onClick={() => {
            setCloseConsent(true);
          }}
        >
          <Icon.Close />
        </Button>

        {copy && renderContent()}
        <ButtonGroup className='padding-top-2'>
          <Button
            onClick={() => {
              SetCookieConsentResponded(true);
              SetCookieConsentAnswer(false);
              
            }}
            outline={true}
            type='button'
          >
            Decline Cookies
          </Button>
          <Button
            onClick={() => {
              SetCookieConsentResponded(true);
              SetCookieConsentAnswer(true);
            }}
            type='button'
          >
            Accept Cookies
          </Button>
        </ButtonGroup>
      </Alert>
    </div>
  );
};
