import React from 'react';
import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import { COOKIE_CONSENT_KEY } from './utils';
import { CookieConsent } from './index';

describe('Cookie consent form should render with correct content.', () => {
  const cookieData = {
    title: 'Cookie Consent',
    copy: '<p>We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our <a href="https://www.nasa.gov/privacy/#cookies">Privacy Policy</a></p>We use cookies to enhance your browsing experience and to help us understand how our website is used. These cookies allow us to collect data on site usage and improve our services based on your interactions. To learn more about it, see our [Privacy Policy](https://www.nasa.gov/privacy/#cookies)'
  };
  const onFormInteraction = jest.fn();
  beforeEach(() => {
    render(
      <CookieConsent {...cookieData} onFormInteraction={onFormInteraction} />
    );
  });
  it('Renders correct content', () => {
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

  it('Check correct cookie initialization', () => {
    const resultCookie = document.cookie;

    expect(resultCookie).toBe(
      `${COOKIE_CONSENT_KEY}={"responded":false,"answer":false}`
    );
  });

  it('Check correct cookie content on Decline click', () => {
    const button = screen.getByRole('button', { name: 'Decline Cookies' });
    fireEvent.click(button);
    const resultCookie = document.cookie;
    expect(resultCookie).toBe(
      `${COOKIE_CONSENT_KEY}={"responded":true,"answer":false}`
    );
  });

  it('Check correct cookie content on Accept click', () => {
    const button = screen.getByRole('button', { name: 'Accept Cookies' });
    fireEvent.click(button);
    const resultCookie = document.cookie;

    expect(resultCookie).toBe(
      `${COOKIE_CONSENT_KEY}={"responded":true,"answer":true}`
    );
  });
});
