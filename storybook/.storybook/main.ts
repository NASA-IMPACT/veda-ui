import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-vitest'],
  staticDirs: ['../static'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern',
            loadPaths: [
              path.resolve(__dirname, '../../node_modules/@uswds/uswds/packages'),
              path.resolve(__dirname, '../../node_modules/@uswds'),
              path.resolve(__dirname, '../../node_modules')
            ]
          }
        }
      }
    });
  }
};
export default config;
