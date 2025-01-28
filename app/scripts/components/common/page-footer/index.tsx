import React, { useMemo } from 'react';
import { Icon } from '@trussworks/react-uswds';
import { DropdownNavLink, NavLinkItem } from '../types';
import { ActionNavItem, NavItemType } from '../page-header/types';
import { NavItemCTA } from '../page-header/nav/nav-item-cta';
import ReturnToTopButton from './return-to-top-button';

import { LinkProperties } from '$types/veda';
import {
  USWDSFooter,
  USWDSFooterNav,
  USWDSAddress
} from '$components/common/uswds';

interface PageFooterProps {
  mainNavItems: (NavLinkItem | DropdownNavLink | ActionNavItem)[];
  subNavItems: (NavLinkItem | DropdownNavLink | ActionNavItem)[];
  hideFooter?: boolean;
  logoSvg?: SVGElement | JSX.Element;
  linkProperties: LinkProperties;
  footerSettings: {
    secondarySection: {
      division: string;
      version: string;
      title: string;
      name: string;
      to: string;
      type: string;
    };
    returnToTop: boolean;
  };
}

export default function PageFooter({
  mainNavItems,
  subNavItems,
  hideFooter,
  logoSvg,
  linkProperties,
  footerSettings
}: PageFooterProps) {
  const { returnToTop, secondarySection } = footerSettings;
  const FooterNavItemInternalLink = (item) => {
    const { item: linkContents, linkClasses, linkProperties } = item;
    if (linkProperties.LinkElement) {
      const path = {
        [linkProperties.pathAttributeKeyName]: linkContents.to
      };
      const LinkElement = linkProperties.LinkElement;
      return (
        <LinkElement
          key={linkContents.id}
          {...path}
          className={linkClasses}
          id={linkContents.id}
        >
          <span>{linkContents.title}</span>
        </LinkElement>
      );
    }
    // If the link provided is invalid, do not render the element
    return null;
  };

  const createNavElement = (navItems, linkClasses) => {
    //removing 'dropdown' items from array
    const cleanedNavItems = navItems.filter((a) => {
      if (a.type !== 'dropdown') {
        return a;
      }
    });

    return cleanedNavItems.map((item) => {
      switch (item.type) {
        case NavItemType.ACTION:
          return <NavItemCTA item={item} customClasses={linkClasses} />;

        case NavItemType.EXTERNAL_LINK:
          return (
            <a className={linkClasses} href={item.to} key={item.id}>
              {item.title}
            </a>
          );
        case NavItemType.INTERNAL_LINK:
          return (
            <FooterNavItemInternalLink
              item={item}
              linkClasses={linkClasses}
              linkProperties={linkProperties}
            />
          );

        default:
          return <></>;
      }
    });
  };
//FIND a way to remove util classes at this level tablet:padding-0 padding-x-0 padding-y-4
  const primaryItems = useMemo(
    () =>
      createNavElement(mainNavItems, 'usa-footer__primary-link tablet:padding-0 padding-x-0 padding-y-4'),
    [mainNavItems]
  );
  const secondaryItems = useMemo(
    () =>
      createNavElement(subNavItems, 'usa-link text-base-dark text-underline'),
    [mainNavItems]
  );

  return (
    <USWDSFooter
      size='slim'
      returnToTop={returnToTop && <ReturnToTopButton />}
      className={hideFooter && 'display-none'}
      primary={
        <div className='grid-row usa-footer__primary-container footer_primary_container'>
          <div className='mobile-lg:grid-col-8 mobile-lg:padding-x-0'>
            <USWDSFooterNav
              aria-label='Footer navigation'
              size='slim'
              links={primaryItems}
              className='padding-x-0'
            />
          </div>
          <div className='tablet:grid-col-4 mobile-lg:grid-col-8'>
            <USWDSAddress
              size='slim'
              items={secondaryItems}

            />
          </div>
        </div>
      }
      secondary={
        <div id='footer_secondary_container' className='grid-row'>
          <div id='logo-container'>
            <a id='logo-container-link' href='#'>
              {logoSvg as JSX.Element}
              <span className='footer-text'>
                {secondarySection.division} • {secondarySection.version}
              </span>
            </a>
          </div>
          <div className='grid-col-4 footer-text grid-gap-6 flex-justify-end'>
            <span>{secondarySection.title}: </span>
            <a
              key={secondarySection.type}
              href={`mailto:${secondarySection.to}`}
              className='text-primary-light'
            >
              <Icon.Mail
                className='margin-right-1 width-205 height-auto position-relative'
                id='mail_icon'
              />
              {secondarySection.name}
            </a>
          </div>
        </div>
      }
    />
  );
}
