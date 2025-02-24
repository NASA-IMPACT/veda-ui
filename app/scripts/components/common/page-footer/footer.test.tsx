import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { navItems } from '../../../../../mock/veda.config.js';
import { VedaUIConfigProvider } from '../../../../../test/utils.js';
import NasaLogoColor from '../nasa-logo-color';
import { NavItem } from '../page-header/types.js';

import PageFooter from './index';

const defaultFooterSetting = {
  secondarySection: {
    division: 'NASA EarthData 2024',
    version: 'BETA VERSION',
    title: 'NASA Official',
    name: 'Manil Maskey',
    to: 'test@example.com',
    type: 'email'
  },
  returnToTop: true
};

const mockMainNavItems: NavItem[] = navItems.footerNavItems;
const mockSubNavItems: NavItem[] = navItems.footerSubNavItems;
const hideFooter = false;

jest.mock('./default-config', () => ({
  footerSettings: {
    secondarySection: {
      division: 'NASA EarthData 2024',
      version: 'BETA VERSION',
      title: 'NASA Official',
      name: 'test',
      to: 'test@example.com',
      type: 'email'
    },
    returnToTop: true
  }
}));

describe('PageFooter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('renders the PageFooter', () => {
    render(
      <BrowserRouter basename=''>
        <VedaUIConfigProvider>
          <PageFooter
            mainNavItems={mockMainNavItems}
            subNavItems={mockSubNavItems}
            hideFooter={hideFooter}
            logoSvg={<NasaLogoColor />}
            footerSettings={defaultFooterSetting}
          />
        </VedaUIConfigProvider>
      </BrowserRouter>
    );
    const footerElement = document.querySelector('footer');

    expect(footerElement).toBeInTheDocument();
    expect(footerElement).not.toHaveClass('display-none');
  });

  test('renders correct buttons and links', () => {
    render(
      <BrowserRouter basename=''>
        <VedaUIConfigProvider>
          <PageFooter
            mainNavItems={mockMainNavItems}
            subNavItems={mockSubNavItems}
            hideFooter={hideFooter}
            logoSvg={<NasaLogoColor />}
            footerSettings={defaultFooterSetting}
          />
        </VedaUIConfigProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Data Catalog')).toBeInTheDocument();
    expect(screen.getByText('Exploration')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Return to top')).toBeInTheDocument();
  });
});

describe('PageFooter dynamic settings', () => {
  test('Hide footer should function correctly', () => {
    jest.mock('./default-config', () => ({
      footerSettings: {
        secondarySection: {
          division: 'NASA EarthData 2024',
          version: 'BETA VERSION',
          title: 'NASA Official',
          name: 'test',
          to: 'test@example.com',
          type: 'email'
        },
        returnToTop: true
      }
    }));
    render(
      <BrowserRouter basename=''>
        <VedaUIConfigProvider>
          <PageFooter
            mainNavItems={mockMainNavItems}
            subNavItems={mockSubNavItems}
            hideFooter={true}
            logoSvg={<NasaLogoColor />}
            footerSettings={defaultFooterSetting}
          />
        </VedaUIConfigProvider>
      </BrowserRouter>
    );
    const footerElement = document.querySelector('footer');
    expect(footerElement).toHaveClass('display-none');
  });
});
