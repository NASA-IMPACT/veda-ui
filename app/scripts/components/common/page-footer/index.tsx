import React, { ComponentType } from 'react';
import { Icon } from '@trussworks/react-uswds';
import NasaLogoColor from '../../nasa-logo-color.js';
import {
  USWDSFooter,
  USWDSLink,
  USWDSFooterNav,
  USWDSLogo,
  USWDSAddress
} from '$components/common/uswds';
import './styles.scss';

interface PageFooterProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logoSvg?: SVGElement | JSX.Element;
  linkProperties: LinkProperties;
  title: string;
  version?: string;
  hidefooter?: boolean;
}

export default function PageFooter({ hidefooter }: PageFooterProps) {
  const returnToTop = () => {
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

  return (
    <>
      <USWDSFooter
        size='slim'
        returnToTop={returnToTop()}
        // className={hidefooter && 'display-none'}
        primary={
          <div
            id='footer_primary_container'
            className=' grid-row bg-base-lightest'
          >
            <div className='mobile-lg:grid-col-8'>
              <USWDSFooterNav
                aria-label='Footer navigation'
                size='slim'
                links={Array(4).fill(
                  <a className='usa-footer__primary-link' href='#'>
                    PrimaryLink
                  </a>
                )}
              />
            </div>
            <div className='tablet:grid-col-4'>
              <USWDSAddress
                size='slim'
                className='flex-justify-end'
                items={[
                  <a className='usa-link text-base-dark' key='#' href='#'>
                    News and Events
                  </a>,
                  <a className='usa-link text-base-dark' key='#' href='#'>
                    About
                  </a>,
                  <a className='usa-link text-base-dark' key='#' href='#'>
                    Contact Us
                  </a>
                ]}
              />
            </div>
          </div>
        }
        secondary={
          <div id='footer_secondary_container' className='grid-row'>
            <div id='logo-container'>
              <a id='logo-container-link' href='#'>
                {NasaLogoColor()}
                <span className='footer-text'>
                  NASA EarthData 2024 • v0.17.0
                  {/* {version} */}
                </span>
              </a>
            </div>
            <div className='grid-col-4 footer-text grid-gap-6'>
              <span>NASA Official: </span>
              <a key='email' href='mailto:info@agency.gov'>
                <Icon.Mail
                  className='margin-right-1 width-205 height-auto position-relative'
                  id='mail_icon'
                />
                info@agency.gov
              </a>
            </div>
          </div>
        }
      />
    </>
  );
}
