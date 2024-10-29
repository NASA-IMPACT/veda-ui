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
  const nameEQ = name + '=';
  const attribute = document.cookie.split(';');
  const cookie = attribute.find((cookie) => cookie.trim().startsWith(nameEQ));
  return cookie ? cookie.substring(nameEQ.length).trim() : null;
};
