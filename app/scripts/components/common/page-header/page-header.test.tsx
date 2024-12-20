import React, { ComponentType } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { navItems } from '../../../../../mock/veda.config.js';
import NasaLogoColor from '../nasa-logo-color';
import { NavItem } from './types';
import PageHeader from './index';

// @NOTE: Possible Test cases
// config & create dynamic nav menu list fn - different scenerios, happy vs unhappy path

const mockMainNavItems: NavItem[] = navItems.mainNavItems;
const mockSubNavItems: NavItem[] = navItems.subNavItems;

const mockLinkProperties = {
  pathAttributeKeyName: 'to',
  LinkElement: 'a' as unknown as ComponentType
};
const testTitle = 'Test Title';

describe('PageHeader', () => {
  beforeEach(() => {
    render(
      <PageHeader
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        logoSvg={<NasaLogoColor />}
        title={testTitle}
        linkProperties={mockLinkProperties}
      />
    );
  });

  test('renders the PageHeader component title', () => {
    expect(screen.getByTestId('header')).toHaveTextContent(testTitle);
  });

  test('renders the PageHeader nav items', () => {
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    const primaryNav = within(navElement).getAllByRole('list')[0];
    const secondaryNav = within(navElement).getAllByRole('list')[1];

    expect(primaryNav.childElementCount).toEqual(mockMainNavItems.length);
    expect(secondaryNav.childElementCount).toEqual(mockSubNavItems.length);
    expect(within(primaryNav).getByText('Test')).toBeInTheDocument();
    expect(within(primaryNav).getByText('Data Catalog')).toBeInTheDocument();
    expect(within(primaryNav).getByText('Exploration')).toBeInTheDocument();
    expect(within(primaryNav).getByText('Stories')).toBeInTheDocument();

    expect(within(secondaryNav).getByText('About')).toBeInTheDocument();
  });

  test('the nav items are clickable and open the drop down', async () => {
    const user = userEvent.setup();
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    const primaryNav = within(navElement).getAllByRole('list')[0];
    const navItem = screen.getByText('Test');
    expect(
      within(primaryNav).getByText('dropdown menu item 1')
    ).not.toBeVisible();
    await user.click(navItem);
    expect(within(primaryNav).getByText('dropdown menu item 1')).toBeVisible();
  });
});
