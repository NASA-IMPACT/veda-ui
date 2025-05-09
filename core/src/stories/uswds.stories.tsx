import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { USWDSButton } from '$uswds';

const meta: Meta<typeof USWDSButton> = {
  title: 'Components/Button',
  component: USWDSButton
};

export default meta;
type Story = StoryObj<typeof USWDSButton>;
export const Button: Story = {
  render: (args) => <USWDSButton {...args}>Click Me</USWDSButton>,
  args: {
    type: 'button',
    secondary: false,
    base: true,
    accentStyle: 'primary',
    outline: false,
    inverse: false,
    size: 'medium',
    unstyled: false,
    onClick: () => alert('Button clicked!'),
    className: 'custom-class'
  }
};
