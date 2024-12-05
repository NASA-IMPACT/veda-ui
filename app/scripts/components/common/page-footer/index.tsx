import React from 'react';
import NasaLogoColor from '../../nasa-logo-color';

import {
  USWDSFooter,
  USWDSLink,
  USWDSFooterNav,
  USWDSLogo
} from '$components/common/uswds';
export default function PageFooter() {
  return (
    <>
      <USWDSFooter
        size='slim'
        // returnToTop={returnToTop}
        primary={
          <div className='usa-footer__primary-container grid-row bg-base-lightest'>
            <div className='mobile-lg:grid-col-8'>
              <USWDSFooterNav
                size='slim'
                links={Array(4).fill(
                  <USWDSLink
                    variant='nav'
                    href='#'
                    className='usa-footer__primary-link'
                  >
                    Primary Link
                  </USWDSLink>
                )}
              />
            </div>
          </div>
        }
        secondary={
          <USWDSLogo
            size='slim'
            //Nasa logo not showing.
            image={<NasaLogoColor />}
            heading={<p className='usa-footer__logo-heading'>Name of Agency</p>}
          />
        }
      />
    </>
  );
}
