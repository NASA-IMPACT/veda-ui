import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { NavLink } from 'react-router-dom';
import { LinkProperties } from '../card';
import NasaLogoColor from '../nasa-logo-color';
import { NavItem, NavItemType } from './types';
import PageHeader from './index';

const mockMainNavItems: NavItem[] = [
  {
    title: 'Data Catalog',
    to: '/data-catalog',
    type: NavItemType.INTERNAL_LINK
  },
  {
    title: 'Exploration',
    to: '/exploration',
    type: NavItemType.INTERNAL_LINK
  },
  {
    title: 'Stories',
    to: '/stories',
    type: NavItemType.INTERNAL_LINK
  }
];

const mockSubNavItems: NavItem[] = [
  {
    title: 'About',
    to: '/about',
    type: NavItemType.INTERNAL_LINK
  },
  {
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
  beforeAll(() => {
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
    expect(screen.getByTestId('extended-nav')).toHaveTextContent('Exploration');
  });
});
