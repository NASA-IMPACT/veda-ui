import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // For testing
import { createMemoryHistory } from 'history';

import * as utils from './utils';
import CookieConsent from './index';
const lodash = require('lodash');

describe('Cookie consent form should render with correct content.', () => {
  const setDisplayCookieConsent = jest.fn();
  const setGoogleTagManager = jest.fn();
  const cookieData = {
    title: 'Cookie Consent',
    copy: '<p>We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our <a href="https://www.nasa.gov/privacy/#cookies">Privacy Policy</a></p>We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our [Privacy Policy](https://www.nasa.gov/privacy/#cookies)',
    setDisplayCookieConsent,
    setGoogleTagManager
  };

  const onFormInteraction = jest.fn();

  const history = createMemoryHistory({ initialEntries: ['/home'] });

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
      pathname: 'localhost:3000/example/path'
    })
  }));

  lodash.debounce = jest.fn((fn) => fn);

  afterEach(() => {
    jest.clearAllMocks();

    // Clear cookies after each test
    document.cookie = `${utils.COOKIE_CONSENT_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  it('Renders correct content', () => {
    render(
      <MemoryRouter history={history}>
        <CookieConsent {...cookieData} onFormInteraction={onFormInteraction} />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', 'https://www.nasa.gov/privacy/#cookies');
    expect(
      screen.getByRole('button', { name: 'Decline Cookies' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Accept Cookies' })
    ).toBeInTheDocument();
    expect(screen.getByText('Cookie Consent')).toBeInTheDocument();
    expect(
      screen.getByText(
        'We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our'
      )
    ).toBeInTheDocument();
  });

  it('Check correct cookie content on Decline click', () => {
    render(
      <MemoryRouter history={history}>
        <CookieConsent {...cookieData} onFormInteraction={onFormInteraction} />
      </MemoryRouter>
    );
    const button = screen.getByRole('button', { name: 'Decline Cookies' });
    fireEvent.click(button);
    const resultCookie = document.cookie;
    expect(resultCookie).toBe(
      `${utils.COOKIE_CONSENT_KEY}={"responded":true,"answer":false}`
    );
  });

  it('Check correct cookie content on Accept click', () => {
    render(
      <MemoryRouter history={history}>
        <CookieConsent {...cookieData} onFormInteraction={onFormInteraction} />
      </MemoryRouter>
    );
    const acceptButton = screen.getByRole('button', { name: 'Accept Cookies' });
    fireEvent.click(acceptButton);
    const resultCookie = document.cookie;

    expect(resultCookie).toBe(
      `${utils.COOKIE_CONSENT_KEY}={"responded":true,"answer":true}`
    );
  });
});
