import React from 'react';
import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // For testing
import { createMemoryHistory } from 'history';
import * as utils from './utils';

import CookieConsent from './index';

describe('Cookie consent form should render with correct content.', () => {
  const cookieData = {
    title: 'Cookie Consent',
    copy: '<p>We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our <a href="https://www.nasa.gov/privacy/#cookies">Privacy Policy</a></p>We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our [Privacy Policy](https://www.nasa.gov/privacy/#cookies)'
  };

  const onFormInteraction = jest.fn();

  const history = createMemoryHistory({ initialEntries: ['/home'] });

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
      pathname: 'localhost:3000/example/path'
    })
  }));
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Check that session item is non existant prior to cookie consent render. Then confirm that cookie consent creates session item.', () => {
    expect(sessionStorage.getItem(utils.SESSION_KEY)).toBeNull();
    render(
      <MemoryRouter history={history}>
        <CookieConsent {...cookieData} onFormInteraction={onFormInteraction} />
      </MemoryRouter>
    );
    expect(sessionStorage.getItem(utils.SESSION_KEY)).toBe(`true`);
  });
  it('Check that getcookie is only called once on render and session item is true', () => {
    const spy = jest.spyOn(utils, 'getCookie');

    render(
      <MemoryRouter history={history}>
        <CookieConsent {...cookieData} onFormInteraction={onFormInteraction} />
      </MemoryRouter>
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(utils.SESSION_KEY)).toBe(`true`);
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
    const button = screen.getByRole('button', { name: 'Accept Cookies' });
    fireEvent.click(button);
    const resultCookie = document.cookie;

    expect(resultCookie).toBe(
      `${utils.COOKIE_CONSENT_KEY}={"responded":true,"answer":true}`
    );
  });
});
