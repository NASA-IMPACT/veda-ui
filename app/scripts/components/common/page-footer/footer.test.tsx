import React from 'react';
import { render, screen } from '@testing-library/react';
import { navItems, footerSettings } from '../../../../../mock/veda.config.js';
import NasaLogoColor from '../nasa-logo-color';
import { NavItem } from '../page-header/types.js';

import PageFooter from './index';

const mockMainNavItems: NavItem[] = navItems.mainNavItems;
const mockSubNavItems: NavItem[] = navItems.subNavItems;
const mockFooterSettings = footerSettings;
const hideFooter = false;

describe('PageFooter', () => {
  beforeEach(() => {
    render(
      <PageFooter
        settings={mockFooterSettings}
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        hideFooter={hideFooter}
        logoSvg={<NasaLogoColor />}
      />
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('renders the PageFooter', () => {
    const footerElement = document.querySelector('footer');

    expect(footerElement).toBeInTheDocument();
    expect(footerElement).not.toHaveClass('display-none');
  });
  test('renders correct buttons and links', () => {
    expect(screen.getByText('Data Catalog')).toBeInTheDocument();
    expect(screen.getByText('Exploration')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Return to top')).toBeInTheDocument();
  });
});

describe('PageFooter dynamic functionality', () => {
  test('Return to top does not show', () => {
    const updatedMockSettings = { ...mockFooterSettings, returnToTop: false };

    render(
      <PageFooter
        settings={updatedMockSettings}
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        hideFooter={hideFooter}
        logoSvg={<NasaLogoColor />}
      />
    );
    expect(() => screen.getByText('Return to top')).toThrow();
  });
  test('Hide footer should function correctly', () => {
    const updatedMockSettings = { ...mockFooterSettings, returnToTop: false };

    render(
      <PageFooter
        settings={updatedMockSettings}
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        hideFooter={true}
        logoSvg={<NasaLogoColor />}
      />
    );
    const footerElement = document.querySelector('footer');
    expect(footerElement).toHaveClass('display-none');
  });
});
