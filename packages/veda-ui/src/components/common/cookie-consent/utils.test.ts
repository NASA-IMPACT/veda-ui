import { readCookie, COOKIE_CONSENT_KEY } from './utils';

describe('onCookie', () => {
  let cookieValue;
  beforeEach(() => {
    cookieValue = { responded: false, answer: false };
    // Mutating docmument cookie property for test
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `CookieConsent={"responded":true,"answer":false}; _somethingelse=GS1.1.17303800; ${COOKIE_CONSENT_KEY}=${JSON.stringify(
        cookieValue
      )}`
    });
  });

  it('should parse cookie value correctly', () => {
    const cookieJsonVal = readCookie(COOKIE_CONSENT_KEY);
    expect(JSON.parse(cookieJsonVal)).toMatchObject(cookieValue);
  });
});
