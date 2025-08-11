import type { Preview } from '@storybook/react';

// Import USWDS core styles globally for all stories
import '@uswds/uswds/css/uswds.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
