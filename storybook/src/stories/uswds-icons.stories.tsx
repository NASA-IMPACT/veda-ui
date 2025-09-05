import React from 'react';
import { Meta } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';

export default {
  title: 'USWDS/Icons',
  component: Icon.ArrowForward,
  args: {
    size: 5,
    color: 'teal',
    'aria-hidden': 'true'
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [3, 4, 5, 6, 7, 8, 9],
      description: 'Icon size',
      table: {
        type: { summary: '3 | 4 | 5 | 6 | 7 | 8 | 9' },
        defaultValue: { summary: '5' }
      }
    }
  }
} as Meta;

export const ArrowForward = (args) => <Icon.ArrowForward {...args} />;
export const Autorenew = (args) => <Icon.Autorenew {...args} />;
export const Assessment = (args) => (
  <Icon.Assessment
    {...args}
    aria-hidden='false'
    aria-label='View layer options'
  />
);

export const AllIcons = (args) => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
    <Icon.ArrowForward {...args} />
    <Icon.Autorenew {...args} />
    <Icon.Assessment {...args} />
  </div>
);
