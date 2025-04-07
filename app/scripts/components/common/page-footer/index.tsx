import React, { useMemo } from 'react';
import { Icon } from '@trussworks/react-uswds';
import { NavItem } from '../page-header/types';
import { createDynamicNavMenuList } from '../page-header/nav/create-dynamic-nav-menu-list';
import ReturnToTopButton from './return-to-top-button';
import { USWDSFooter, USWDSFooterNav, USWDSAddress } from '$uswds';

interface PageFooterProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  hideFooter?: boolean;
  logoSvg?: SVGElement | JSX.Element;
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
  footerSettings
}: PageFooterProps) {
  const { returnToTop, secondarySection } = footerSettings;

  const primaryItems = useMemo(
    () => createDynamicNavMenuList({ navItems: mainNavItems }),
    [mainNavItems]
  );
  const secondaryItems = useMemo(
    () => createDynamicNavMenuList({ navItems: subNavItems }),
    [subNavItems]
  );

  return (
    <USWDSFooter
      size='slim'
      returnToTop={returnToTop && <ReturnToTopButton />}
      className={hideFooter && 'display-none'}
      primary={
        <div className='grid-row usa-footer__primary-container footer_primary_container '>
          <div className='mobile-lg:grid-col-8 mobile-lg:padding-x-0 flex-align-self-center'>
            <USWDSFooterNav
              aria-label='Footer navigation'
              size='slim'
              links={primaryItems}
              className='padding-x-0 width-auto'
            />
          </div>
          <div className='tablet:grid-col-4 mobile-lg:grid-col-8'>
            <USWDSAddress size='slim' items={secondaryItems} />
          </div>
        </div>
      }
      secondary={
        <div id='footer_secondary_container' className='grid-row'>
          <div
            id='logo-container'
            className='margin-bottom-2 tablet:margin-bottom-0'
          >
            <a id='logo-container-link' href='#'>
              {logoSvg as JSX.Element}
              <span className='footer-text'>
                {secondarySection.division} • {secondarySection.version}
              </span>
            </a>
          </div>
          <div className=' mobile-lg:grid-col-4 footer-text  mobile-lg:grid-gap-6 tablet:flex-justify-end mobile-lg:width-auto width-full flex-align-center'>
            <span>{secondarySection.title}: </span>
            <a
              key={secondarySection.type}
              href={`mailto:${secondarySection.to}`}
              className='text-primary-light display-flex flex-align-center'
            >
              <Icon.Mail className='margin-right-1 width-205 height-auto position-relative' />
              {secondarySection.name}
            </a>
          </div>
        </div>
      }
    />
  );
}
