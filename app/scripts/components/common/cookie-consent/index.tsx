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
}

export const CookieConsent = ({ title, copy }: CookieConsentProps) => {
  const [cookieConsentResponded, SetCookieConsentResponded] = useState(Boolean);
  const [cookieConsentAnswer, SetCookieConsentAnswer] = useState(Boolean);
  const [closeConsent, setCloseConsent] = useState(Boolean);
  //Setting expiration date for cookie to expire and re-ask user for consent.
  const setCookieExpiration = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 3);
    return today;
  };

  const setCookie = (cookieValue, closeConsent) => {
    let cookieContent;
    closeConsent
      ? (cookieContent = `CookieConsent=${JSON.stringify(cookieValue)};
path=/;SameSite=true;expires=0`)
      : (cookieContent = `CookieConsent=${JSON.stringify(cookieValue)};
path=/;SameSite=true;expires=${setCookieExpiration()}`);
    document.cookie = cookieContent;
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


  const alertContent =  <>
  <Button
    type={'button'}
    className='usa-modal__close close'
    onClick={() => {
      setCloseConsent(true);
    }}
  >
    <Icon.Close />
  </Button>

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
</>
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
        cta={renderContent()}
        children={alertContent}
      >
      </Alert>
    </div>
  );
};
