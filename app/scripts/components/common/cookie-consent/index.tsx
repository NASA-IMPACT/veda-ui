/** @jsxImportSource @emotion/react */

import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Icon } from '@trussworks/react-uswds';
import { css } from '@emotion/react';
import { setCookie, getCookie } from './utils';
import { USWDSAlert, USWDSButton, USWDSButtonGroup } from '$uswds';

import './index.scss';
interface cookieConsentTheme {
  card?: {
    backgroundColor?: string;
    sideBarColor?: string;
    textColor?: string;
    linkColor?: string;
  };
  acceptButton?: {
    default?: {
      backgroundColor?: string;
      textColor?: string;
    };
    hover?: {
      backgroundColor?: string;
      textColor?: string;
    };
  };
  declineButton?: {
    default?: {
      borderColor?: string;
      textColor?: string;
    };
    hover?: {
      borderColor?: string;
      textColor?: string;
    };
  };
  iconColor?: { default?: string; hover?: string };
}
interface CookieConsentProps {
  title?: string | undefined;
  copy?: string | undefined;
  pathname: string;
  theme?: cookieConsentTheme;
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
  theme,
  setDisplayCookieConsentForm,
  setGoogleTagManager
}: CookieConsentProps) => {
  const [cookieConsentResponded, setCookieConsentResponded] =
    useState<boolean>(false);
  // Debounce the setDisplayCookieConsentForm function
  const debouncedSetCookieConsentResponded = debounce(
    setCookieConsentResponded,
    500
  );

  const [cookieConsentAnswer, setCookieConsentAnswer] =
    useState<boolean>(false);
  const [closeConsent, setCloseConsent] = useState<boolean>(false);

  useEffect(() => {
    const cookieContents = getCookie();
    if (cookieContents) {
      if (!cookieContents.responded) {
        setCloseConsent(false);
        return;
      }
      cookieContents.answer && setGoogleTagManager();
      setCookieConsentResponded(cookieContents.responded);
      setCookieConsentAnswer(cookieContents.answer);
      setDisplayCookieConsentForm(false);
    } else {
      setCloseConsent(false);
    }
    // Only run on the first render
  }, [setGoogleTagManager, setDisplayCookieConsentForm]);

  useEffect(() => {
    if (!cookieConsentResponded) setCloseConsent(false);
    // To render the component when user hasn't answered yet
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
    setTimeout(() => {
      setDisplayCookieConsentForm(false);
    }, 500);
  }, [
    cookieConsentResponded,
    cookieConsentAnswer,
    closeConsent,
    setDisplayCookieConsentForm,
    setGoogleTagManager
  ]);

  const transitionSettings = ` -webkit-transition: all 0.24s ease 0s; transition: all 0.24s ease 0s;`;

  const themeValueCheck = (themeItem) => {
    //checking for null, undefined or empty string values
    return themeItem !== undefined || themeItem !== '' ? true : false;
  };
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
            type={!themeValueCheck(theme?.card?.backgroundColor) && 'info'}
            heading={title && title}
            headingLevel='h2'
            noIcon={true}
            className='radius-lg'
            css={css`
              ${themeValueCheck(theme?.card?.backgroundColor) &&
              `background-color: ` + theme?.card?.backgroundColor};

              ${themeValueCheck(theme?.card?.sideBarColor) &&
              `border-left: 0.5rem solid ` + theme?.card?.sideBarColor};
              ${themeValueCheck(theme?.card?.textColor) &&
              `h2 {
                color:` + theme?.card?.textColor}
            `}
          >
            <USWDSButton
              type='button '
              className='width-3 height-3 padding-0 position-absolute right-2 top-2'
              onClick={() => {
                setCloseConsent(true);
              }}
              unstyled
            >
              <Icon.Close
                size={3}
                css={css`
                  ${transitionSettings}
                  ${themeValueCheck(theme?.iconColor?.default) &&
                  `color: ` + theme?.iconColor?.default};
                  ${themeValueCheck(theme?.iconColor?.hover) &&
                  `:hover {
                    color: ` + theme?.iconColor?.hover};
                `}
              />
            </USWDSButton>

            {copy && (
              <div
                css={css`
                  ${themeValueCheck(theme?.card?.textColor) &&
                  `color: ` + theme?.card?.textColor};
                  ${transitionSettings}
                  ${themeValueCheck(theme?.card?.linkColor) &&
                  ` a:not([class]):visited {
                        color: ` + theme?.card?.linkColor}
                `}
                dangerouslySetInnerHTML={{ __html: addAttribute(copy) }}
              />
            )}
            <USWDSButtonGroup className='padding-top-2'>
              <USWDSButton
                onClick={() => {
                  debouncedSetCookieConsentResponded(true);
                  setCookieConsentAnswer(false);
                  setCloseConsent(true);
                }}
                outline={true}
                type='button'
                css={css`
                  ${transitionSettings}

                  ${themeValueCheck(theme?.iconColor?.default) &&
                  `box-shadow: inset 0 0 0 2px ` +
                    theme?.declineButton?.default?.borderColor};

                  ${themeValueCheck(theme?.declineButton?.default?.textColor) &&
                  `color: ` + theme?.declineButton?.default?.textColor};

                  ${themeValueCheck(theme?.declineButton?.hover?.borderColor) &&
                  `:hover {
                    box-shadow: inset 0 0 0 2px ` +
                    theme?.declineButton?.hover?.borderColor};

                  ${themeValueCheck(theme?.declineButton?.hover?.textColor) &&
                  `color: ` + theme?.declineButton?.hover?.textColor};
                `}
              >
                Decline Cookies
              </USWDSButton>
              <USWDSButton
                onClick={() => {
                  debouncedSetCookieConsentResponded(true);
                  setCookieConsentAnswer(true);
                  setCloseConsent(true);
                }}
                type='button'
                css={css`
                  ${transitionSettings}
                  ${themeValueCheck(
                    theme?.acceptButton?.default?.backgroundColor
                  ) &&
                  `background-color:  ` +
                    theme?.acceptButton?.default?.backgroundColor};
                  ${themeValueCheck(theme?.acceptButton?.default?.textColor) &&
                  `color: ` + theme?.acceptButton?.default?.textColor};
                  ${themeValueCheck(
                    theme?.acceptButton?.hover?.backgroundColor
                  ) &&
                  `:hover {
                    background-color: ` +
                    theme?.acceptButton?.hover?.backgroundColor};
                  ${themeValueCheck(theme?.acceptButton?.hover?.textColor) &&
                  `color: ` + theme?.acceptButton?.hover?.textColor};
                `}
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
