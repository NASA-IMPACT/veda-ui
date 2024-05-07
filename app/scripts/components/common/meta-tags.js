import React from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTheme } from 'styled-components';
import { useLocation } from 'react-router-dom';

const appTitle = process.env.APP_TITLE;
const baseUrl = window.location.origin;

const defaultMetaImage = `${process.env.PUBLIC_URL ?? ''}/meta/meta-image.png`;

function MetaTags({ title, description, thumbnail, children }) {
  const theme = useTheme();
  const location = useLocation();

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
      <meta name='twitter:image' content={thumbnail || defaultMetaImage} />

      {/* Open Graph */}
      <meta property='og:type' content='website' />
      <meta
        property='og:url'
        content={`${baseUrl}${location.pathname}` || baseUrl}
      />
      <meta property='og:site_name' content={appTitle} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={thumbnail || defaultMetaImage} />
      {description ? (
        <meta property='og:description' content={description} />
      ) : null}

      {/* Additional children */}
      {children}

      {/* Additional javascript */}
      {/* @NOTE https://github.com/NASA-IMPACT/veda-ui/pull/846 */}
      {process.env.CUSTOM_SCRIPT_SRC ? (
        <script
          async
          type='text/javascript'
          src={process.env.CUSTOM_SCRIPT_SRC}
          id={
            process.env.CUSTOM_SCRIPT_ID
              ? process.env.CUSTOM_SCRIPT_ID
              : 'custom_script_id'
          }
        />
      ) : null}
    </Helmet>
  );
}

MetaTags.propTypes = {
  title: T.string,
  description: T.string,
  thumbnail: T.string,
  children: T.node
};

export default MetaTags;
