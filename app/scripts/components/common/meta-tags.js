import React from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTheme } from 'styled-components';

const baseUrl = process.env.PUBLIC_URL;
const appTitle = process.env.APP_TITLE;

function MetaTags({ title, description, children }) {
  const theme = useTheme();

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name='description' content={description} /> : null}
      <meta name='theme-color' content={theme?.color.primary} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:creator' content='author' />
      <meta name='twitter:title' content={title} />
      {description ? (
        <meta name='twitter:description' content={description} />
      ) : null}
      <meta
        name='twitter:image'
        content={`${baseUrl}/assets/graphics/meta/default-meta-image.png`}
      />

      {/* Open Graph */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={baseUrl} />
      <meta property='og:site_name' content={appTitle} />
      <meta property='og:title' content={title} />
      <meta
        property='og:image'
        content={`${baseUrl}/assets/graphics/meta/default-meta-image.png`}
      />
      {description ? (
        <meta property='og:description' content={description} />
      ) : null}

      {/* Additional children */}
      {children}
    </Helmet>
  );
}

MetaTags.propTypes = {
  title: T.string,
  description: T.string,
  children: T.node
};

export default MetaTags;
