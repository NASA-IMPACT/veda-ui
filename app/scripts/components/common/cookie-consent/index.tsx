import {
  Alert,
  Button,
  ButtonGroup,
  Link,
  Icon
} from '@trussworks/react-uswds';
import React, { useState, useEffect } from 'react';

import './index.scss';

interface CookieConsentProps {
  title: string;
  copy: string;
}

export const CookieConsent = ({ title, copy }: CookieConsentProps) => {
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
    document.cookie = `CookieConsent=${JSON.stringify(cookieValue)}; expires=${closeConsent
      ? '0'
      : setCookieExpiration()}`;
    document.cookie['CookieConsent'] = `path=/;`;
  };

  const renderContent = () => {
    const bracketsParenthRegex = /\[(.*?)\)/;
    const interiroBracketsRegex = /\]\(/;

    let parts = copy.split(bracketsParenthRegex);

    const updatedContent = parts.map((item, key) => {
      if (interiroBracketsRegex.test(item)) {
        let linkParts = item.split(interiroBracketsRegex);
        const newItem = (
          <Link key={key} href={linkParts[1]} target='_blank'>
            {linkParts[0]}
          </Link>
        );
        return newItem;
      }
      return item;
    });
    return updatedContent;
  };

  useEffect(() => {
    const cookieValue = {
      responded: cookieConsentResponded,
      answer: cookieConsentAnswer
    };
    setCookie(cookieValue, closeConsent);
  }, [cookieConsentResponded, cookieConsentAnswer]);

  return (
    <div
      className={`modal margin-2 shadow-2 ${
        cookieConsentResponded || closeConsent ? 'hide-modal' : ''
      }`}
    >
      <Alert
        type='info'
        heading={title}
        headingLevel='h1'
        noIcon={true}
        className='radius-lg'
      >
        <Button
          type={'button'}
          className='usa-modal__close close'
          onClick={() => {
            setCloseConsent(true);
          }}
        >
          <Icon.Close />
        </Button>

        {renderContent()}
        <ButtonGroup className='padding-top-2'>
          <Button
            onClick={() => {
              SetCookieConsentResponded(true);
              SetCookieConsentAnswer(false);
            }}
            outline={true}
            type={'button'}
          >
            Decline Cookies
          </Button>
          <Button
            onClick={() => {
              SetCookieConsentResponded(true);
              SetCookieConsentAnswer(true);
            }}
            type={'button'}
          >
            Accept Cookies
          </Button>
        </ButtonGroup>
      </Alert>
    </div>
  );
};
