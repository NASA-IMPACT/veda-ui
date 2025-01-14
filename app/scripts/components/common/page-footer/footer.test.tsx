import React, { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { navItems } from '../../../../../mock/veda.config.js';
import NasaLogoColor from '../nasa-logo-color';
import { NavItem } from '../page-header/types.js';

import PageFooter from './index';

const mockMainNavItems: NavItem[] = navItems.mainNavItems;
const mockSubNavItems: NavItem[] = navItems.subNavItems;
// const mockFooterSettings = footerSettings;
const hideFooter = false;
const mockLinkProperties = {
  pathAttributeKeyName: 'to',
  LinkElement: 'a' as unknown as ComponentType
};
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
      <PageFooter
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        hideFooter={hideFooter}
        logoSvg={<NasaLogoColor />}
        linkProperties={mockLinkProperties}
      />
    );
    const footerElement = document.querySelector('footer');

    expect(footerElement).toBeInTheDocument();
    expect(footerElement).not.toHaveClass('display-none');
  });

  test('renders correct buttons and links', () => {
    render(
      <PageFooter
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        hideFooter={hideFooter}
        logoSvg={<NasaLogoColor />}
        linkProperties={mockLinkProperties}
      />
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
      <PageFooter
        linkProperties={mockLinkProperties}
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
