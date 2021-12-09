import React from 'react';

import App from '../common/app';

function UhOh() {
  return (
    <App pageTitle='Not Found'>
      <p>UhOh</p>
      <p>That&apos;s a 404 error</p>
      <p>
        We were not able to find the page you are looking for. It may have been
        archived or removed.
      </p>
      <p>
        If you think this page should be here let us know via{' '}
        <a href='mailto:mail' title='Send us an email'>
          email
        </a>
      </p>
    </App>
  );
}

export default UhOh;
