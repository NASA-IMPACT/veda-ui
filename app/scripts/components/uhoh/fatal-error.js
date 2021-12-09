import React from 'react';

import { makeAbsUrl } from '../../utils/history';

import App from '../common/app';

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    return this.state.error ? (
      <App pageTitle='Server error'>
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
      </App>
    ) : (
      // eslint-disable-next-line react/prop-types
      this.props.children
    );
  }
}
