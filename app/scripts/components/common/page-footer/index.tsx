import React, { useMemo } from 'react';
import { Icon } from '@trussworks/react-uswds';
//TO DO: need to move NasaLogoColor outside of component and pass down as props
import { NavItemType } from '../page-header/types.js';
import { NavItemCTA } from '../page-header/nav/nav-item-cta.js';
import {
  USWDSFooter,
  USWDSFooterNav,
  USWDSAddress
} from '$components/common/uswds';

import './styles.scss';

interface PageFooterProps {
  primarySection: any;
  settings: any;
  hideFooter?: boolean;
  logoSvg?: SVGElement | JSX.Element;
}
//TODO: clean up PageFooterProps, Unexpected any. Specify a different interface.

export default function PageFooter({
  settings,
  primarySection,
  hideFooter,
  logoSvg
}: PageFooterProps) {
  const returnToTopButton = () => {
    return (
      <div
        id='return-to-top-container'
        className=' margin-left-auto margin-right-auto padding-x-4'
      >
        <a className='usa-link text-primary' href='#'>
          Return to top
        </a>
      </div>
    );
  };

  const { returnToTop, secondarySection } = settings;
  /* eslint-disable */
  const {
    footerPrimaryContactItems,
    footerPrimaryNavItems,
    mainNavItems,
    subNavItems
  } = primarySection;

  const createNavElement = (navItems, linkClasses) => {
    //removing 'dropdown' items from array
    let cleanedNavItems = navItems.filter((a) => {
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
            <a className={linkClasses} href={item.to} key={item.id}>
              {item.title}
            </a>
          );

        default:
          return <></>;
      }
    });
  };

  const primaryItems = useMemo(
    () => createNavElement(mainNavItems, 'usa-footer__primary-link'),
    [mainNavItems]
  );
  const secondaryItems = useMemo(
    () =>
      createNavElement(subNavItems, 'usa-link text-base-dark text-underline'),
    [mainNavItems]
  );
  return (
    <>
      <USWDSFooter
        size='slim'
        returnToTop={returnToTop && returnToTopButton()}
        className={hideFooter && 'display-none'}
        primary={
          <div
            id='footer_primary_container'
            className=' grid-row bg-base-lightest usa-footer__primary-container'
          >
            <div className='mobile-lg:grid-col-8'>
              <USWDSFooterNav
                aria-label='Footer navigation'
                size='slim'
                links={primaryItems}
              />
            </div>
            <div className='tablet:grid-col-4'>
              <USWDSAddress
                size='slim'
                className='flex-justify-end'
                items={secondaryItems}
              />
            </div>
          </div>
        }
        secondary={
          <div id='footer_secondary_container' className='grid-row'>
            <div id='logo-container'>
              <a id='logo-container-link' href='#'>
                <>{logoSvg}</>
                <span className='footer-text'>
                  NASA EarthData 2024 • v0.17.0
                  {/* {version} */}
                </span>
              </a>
            </div>
            <div className='grid-col-4 footer-text grid-gap-6 flex-justify-end'>
              <span>NASA Official: </span>
              <a
                key={secondarySection.type}
                href={`mailto:${secondarySection.to}`}
              >
                <Icon.Mail
                  className='margin-right-1 width-205 height-auto position-relative'
                  id='mail_icon'
                />
                {secondarySection.title}
              </a>
            </div>
          </div>
        }
      />
    </>
  );
}
