import {
  Alert,
  Button,
  ButtonGroup,
  Link,
  Icon
} from '@trussworks/react-uswds';
import React, { ReactNode, useState, useEffect } from 'react';

import './index.scss';

interface CookieConsentProps {
  title: string;
  copy: string;
  linkUrl: string;
  linkText: string;
}

export const CookieConsent = ({
  title,
  copy,
  linkUrl,
  linkText
}: CookieConsentProps) => {
  const [cookieConsentResponded, SetCookieConsentResponded] = useState(Boolean);
  const [cookieConsentAnswer, SetCookieConsentAnswer] = useState(Boolean);
  const [closeConsent, setCloseConsent] = useState(Boolean);
  //Setting expiration date for cookie to expire and re-ask user for consent.
  const setCookieExpiration = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 3);
    return today;
  };

  const setCookie = (cookieValue) => {
    const expiration = setCookieExpiration();

    // expires= ${expiration}
    document.cookie = `CookieConsent=${JSON.stringify(cookieValue)};
    path=/;SameSite=true;`;
  };
  useEffect(() => {
    const cookieValue = {
      responded: cookieConsentResponded,
      answer: cookieConsentAnswer
    };
    setCookie(cookieValue);
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
        <p className='padding-bottom-2'>
          {copy}{' '}
          <Link href={linkUrl} target='_blank'>
            {linkText}
          </Link>
        </p>
        <ButtonGroup>
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
