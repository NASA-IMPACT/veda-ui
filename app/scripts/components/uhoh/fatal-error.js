import React from 'react';
import UhOh from '.';

import LayoutRoot from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';

import { makeAbsUrl } from '../../utils/history';

import { PageMainContent } from '$styles/page';

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    const { error } = this.state;

    // eslint-disable-next-line react/prop-types
    if (!error) return this.props.children;

    if (error.resNotFound)
      return (
        <LayoutRoot pageTitle='Server error'>
          <UhOh />
        </LayoutRoot>
      );

    return (
      <LayoutRoot pageTitle='Server error'>
        <PageMainContent>
          <PageHero title='Server Error' description="That's a fatal error." />
          <FoldProse>
            <p>
              Something went wrong and we were not able to fulfill your request.
              This is on our side and we&apos;ll fix it!
            </p>
            <p>
              In the meantime you can try again by refreshing the page or visit
              the{' '}
              <a href={makeAbsUrl('/')} title='Visit homepage'>
                homepage
              </a>
              .
            </p>
            <p>
              If this error keeps on happening you can reach us via{' '}
              <a
                href={`mailto:${process.env.APP_CONTACT_EMAIL}`}
                title='Send us an email'
              >
                {process.env.APP_CONTACT_EMAIL}
              </a>
            </p>
          </FoldProse>
        </PageMainContent>
      </LayoutRoot>
    );
  }
}
