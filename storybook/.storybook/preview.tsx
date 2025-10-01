import type { Preview } from '@storybook/react';
import React from 'react';
import { VedaUIProvider } from '$context/veda-ui-provider';
import DevseedUiThemeProvider from '$context/theme-provider';
import ReactQueryProvider from '$context/react-query';

// Import USWDS core styles globally for all stories
import '@uswds/uswds/css/uswds.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      if (context.parameters?.withProviders) {
        return (
          <VedaUIProvider
            config={{
              envMapboxToken: import.meta.env.MAPBOX_TOKEN ?? '',
              envApiStacEndpoint: import.meta.env.API_STAC_ENDPOINT ?? '',
              envApiRasterEndpoint: import.meta.env.API_RASTER_ENDPOINT ?? '',
              envApiCMREndpoint: import.meta.env.API_CMR_ENDPOINT ?? '',
              geoDataPath: `${import.meta.env.PUBLIC_URL ?? ''}/public/geo-data`
            }}
          >
            <DevseedUiThemeProvider>
              <ReactQueryProvider>
                <Story />
              </ReactQueryProvider>
            </DevseedUiThemeProvider>
          </VedaUIProvider>
        );
      }
      return <Story />;
    }
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Library Components',
          'Examples',
          'Guidelines'
        ]
      }
    }
  }
};

export default preview;
