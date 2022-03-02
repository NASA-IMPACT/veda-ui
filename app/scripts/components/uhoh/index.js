import React from 'react';

import { FoldProse } from '$components/common/fold';
import PageHero from '$components/common/page-hero';
import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';

export const resourceNotFound = () => {
  const e = new Error('Resource not found');
  e.resNotFound = true;
  return e;
};

function UhOh() {
  return (
    <>
      <LayoutProps title='Not found' />
      <PageMainContent>
        <PageHero title='Page not found' description="That's a 404 error." />
        <FoldProse>
          <p>
            We were not able to find the page you are looking for. It may have
            been archived or removed.
          </p>
          <p>
            If you think this page should be here let us know via{' '}
            <a
              href={`mailto:${process.env.APP_CONTACT_EMAIL}`}
              title='Send us an email'
            >
              {process.env.APP_CONTACT_EMAIL}
            </a>
          </p>
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default UhOh;
