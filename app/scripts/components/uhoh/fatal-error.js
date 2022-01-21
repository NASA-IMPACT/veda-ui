import React from 'react';
import UhOh from '.';

import LayoutRoot from '../common/layout-root';

import { makeAbsUrl } from '../../utils/history';

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
        <p>UhOh</p>
        <p>That&apos;s a fatal error</p>
        <p>
          Something went wrong and we were not able to fulfill your request.
          This is on our side and we&apos;ll fix it!
        </p>
        <p>
          In the meantime you can try again by refreshing the page or visit the{' '}
          <a href={makeAbsUrl('/')} title='Visit homepage'>
            homepage
          </a>
          .
        </p>
        <p>
          If this error keeps on happening you can reach us via{' '}
          <a href='mailto:mail' title='Send us an email'>
            email
          </a>
        </p>
      </LayoutRoot>
    );
  }
}
