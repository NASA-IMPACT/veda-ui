import React, { ComponentType } from 'react';
import NasaLogoColor from '../../nasa-logo-color.js';
import { Icon } from '@trussworks/react-uswds';

import {
  USWDSFooter,
  USWDSLink,
  USWDSFooterNav,
  USWDSLogo,
  USWDSAddress
} from '$components/common/uswds';
import './styles.scss';

export default function PageFooter() {
  const returnToTop = () => {
    return (
      <div className='maxw-desktop margin-left-auto margin-right-auto padding-x-4'>
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
        primary={
          <div
            id='footer_primary_container'
            className=' grid-row bg-base-lightest'
          >
            <div className='grid-row'>
              <USWDSFooterNav
                size='slim'
                className='flex'
                links={Array(4).fill(
                  <a className='usa-footer__primary-link' href='#'>
                    Primary Link
                  </a>
                )}
              />
              <div className='flex'>
                <USWDSAddress
                  size='slim'
                  className=''
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
          </div>
        }
        secondary={
          <div className='grid-row'>
            <div id='logo-container'>
              <a id='logo-container-link' href='#'>
                {NasaLogoColor()}
                <span className='footer-text'>
                  NASA EarthData 2024 • v0.17.0
                  {/* {version} */}
                </span>
              </a>
            </div>
            <div className='grid-col-4 footer-text flex'>
              <span>NASA Official:</span>
              <a key='email' href='mailto:info@agency.gov'>
                <Icon.Mail />
                info@agency.gov
              </a>
            </div>
          </div>
        }
      />
    </>
  );
}