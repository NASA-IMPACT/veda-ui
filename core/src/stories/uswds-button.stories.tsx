import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { USWDSButton } from '$uswds';

const meta: Meta<typeof USWDSButton> = {
  title: 'Components/Button',
  component: USWDSButton,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof USWDSButton>;

export const Default: Story = {
  args: { type: 'button', children: 'Click Me' }
};

export const Secondary: Story = {
  args: { type: 'button', secondary: true, children: 'Secondary Button' }
};

export const AccentCool: Story = {
  args: { type: 'button', accentStyle: 'cool', children: 'Accent Cool' }
};

export const AccentWarm: Story = {
  args: { type: 'button', accentStyle: 'warm', children: 'Accent Warm' }
};

export const Base: Story = {
  args: { type: 'button', base: true, children: 'Base Button' }
};

export const Outline: Story = {
  args: { type: 'button', outline: true, children: 'Outline Button' }
};

export const Inverse: Story = {
  args: { type: 'button', inverse: true, children: 'Inverse Button' }
};

export const Big: Story = {
  args: { type: 'button', size: 'big', children: 'Big Button' }
};

export const Small: Story = {
  args: { type: 'button', size: 'small', children: 'Small Button' }
};

export const Unstyled: Story = {
  args: { type: 'button', unstyled: true, children: 'Unstyled Button' }
};

export const CustomClass: Story = {
  args: { type: 'button', className: 'custom-class', children: 'Custom Class' }
};

export const Disabled: Story = {
  args: { type: 'button', disabled: true, children: 'Disabled Button' }
};

export const WithClickHandler: Story = {
  args: {
    type: 'button',
    children: 'Click Me',
    onClick: () => alert('Button clicked!')
  }
};
