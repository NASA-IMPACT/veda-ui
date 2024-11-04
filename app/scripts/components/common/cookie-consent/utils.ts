export const COOKIE_CONSENT_KEY = `veda--CookieConsent`;
export const SESSION_KEY = `veda--NewSession`;

export const getCookie = (
  SetCookieConsentResponded,
  SetCookieConsentAnswer,
  setGoogleTagManager
) => {
  const cookie = readCookie(COOKIE_CONSENT_KEY);
  if (cookie) {
    const cookieContents = JSON.parse(cookie);
    if (cookieContents.answer) setGoogleTagManager();
    SetCookieConsentResponded(cookieContents.responded);
    SetCookieConsentAnswer(cookieContents.answer);
  }
};

const readCookie = (name) => {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(name+'=[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./,'') : '');
};
