import React from 'react';
import { getByText, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { NavLink } from 'react-router-dom';
import { LinkProperties } from '$types/veda';
import NasaLogoColor from '../nasa-logo-color';
import { NavItem, NavItemType } from './types';
import PageHeader from './index';

// @NOTE: Possible Test cases
// light vs dark mode
// config & create dynamic nav menu list fn - different scenerios, happy vs unhappy path

const mockMainNavItems: NavItem[] = [
  {
    id: 'data-catalog',
    title: 'Data Catalog',
    to: '/data-catalog',
    type: NavItemType.INTERNAL_LINK
  },
  {
    id: 'exploration',
    title: 'Exploration',
    to: '/exploration',
    type: NavItemType.INTERNAL_LINK
  },
  {
    id: 'stories',
    title: 'Stories',
    to: '/stories',
    type: NavItemType.INTERNAL_LINK
  }
];

const mockSubNavItems: NavItem[] = [
  {
    id: 'about',
    title: 'About',
    to: '/about',
    type: NavItemType.INTERNAL_LINK
  },
  {
    id: 'contact',
    title: 'Contact',
    to: '/contact',
    type: NavItemType.INTERNAL_LINK
  }
];

const mockLinkProperties: LinkProperties = {
  pathAttributeKeyName: 'to',
  LinkElement: NavLink
};

describe('PageHeader', () => {
  beforeEach(() => {
    render(
      <PageHeader
        mainNavItems={mockMainNavItems}
        subNavItems={mockSubNavItems}
        logo={<NasaLogoColor />}
        linkProperties={mockLinkProperties}
      />
    );
  });

  test('renders the PageHeader component title', () => {
    expect(screen.getByTestId('header')).toHaveTextContent(
      'Earthdata VEDA Dashboard'
    );
  });

  test('renders the PageHeader nav items', () => {
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    const primaryNav = within(navElement).getAllByRole('list')[0];
    const secondaryNav = within(navElement).getAllByRole('list')[1];

    expect(primaryNav.childElementCount).toEqual(mockMainNavItems.length);
    expect(secondaryNav.childElementCount).toEqual(mockSubNavItems.length);

    // @TODO: can't find the text content!
    expect(getByText(primaryNav, 'Data Catalog')).toBeInTheDocument();
    expect(within(primaryNav).getByText(/Data Catalog/)).toBeInTheDocument();
    expect(within(primaryNav).getByText('Exploration')).toBeInTheDocument();
    expect(within(primaryNav).getByText('Stories')).toBeInTheDocument();

    expect(within(secondaryNav).getByText('About')).toBeInTheDocument();
    expect(within(secondaryNav).getByText('Contact')).toBeInTheDocument();
  });
});
