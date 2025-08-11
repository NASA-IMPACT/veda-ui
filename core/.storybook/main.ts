import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const uswdsPath = path.resolve(__dirname, '../../app/scripts/uswds');

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        $uswds: uswdsPath
      };
    }
    return config;
  }
};
export default config;
