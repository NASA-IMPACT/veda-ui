export const COOKIE_CONSENT_KEY = `veda--CookieConsent`;
export const SESSION_KEY = `veda--NewSession`;

export const readCookie = (name: string): string => {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(name + '=[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : ''
  );
};

export const getCookie = () => {
  const cookie = readCookie(COOKIE_CONSENT_KEY);
  if (cookie) {
    const cookieContents = JSON.parse(cookie);
    return cookieContents;
  }
};

//Setting expiration date for cookie to expire and re-ask user for consent.
export const setCookieExpiration = () => {
  const today = new Date();
  today.setMonth(today.getMonth() + 3);
  return today.toUTCString();
};

export const setCookie = (cookieValue, closeConsent) => {
  document.cookie = `${COOKIE_CONSENT_KEY}=${JSON.stringify(
    cookieValue
  )}; path=/; expires=${closeConsent ? '0' : setCookieExpiration()}`;
};
