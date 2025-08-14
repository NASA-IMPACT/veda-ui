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
  render: () => <USWDSButton type='button'>Click Me</USWDSButton>
};

export const Secondary: Story = {
  render: () => (
    <USWDSButton type='button' secondary>
      Secondary Button
    </USWDSButton>
  )
};

export const AccentCool: Story = {
  render: () => (
    <USWDSButton type='button' accentStyle='cool'>
      Accent Cool
    </USWDSButton>
  )
};

export const AccentWarm: Story = {
  render: () => (
    <USWDSButton type='button' accentStyle='warm'>
      Accent Warm
    </USWDSButton>
  )
};

export const Base: Story = {
  render: () => (
    <USWDSButton type='button' base>
      Base Button
    </USWDSButton>
  )
};

export const Outline: Story = {
  render: () => (
    <USWDSButton type='button' outline>
      Outline Button
    </USWDSButton>
  )
};

export const Inverse: Story = {
  render: () => (
    <USWDSButton type='button' inverse>
      Inverse Button
    </USWDSButton>
  )
};

export const Big: Story = {
  render: () => (
    <USWDSButton type='button' size='big'>
      Big Button
    </USWDSButton>
  )
};

export const Small: Story = {
  render: () => (
    <USWDSButton type='button' size='small'>
      Small Button
    </USWDSButton>
  )
};

export const Unstyled: Story = {
  render: () => (
    <USWDSButton type='button' unstyled>
      Unstyled Button
    </USWDSButton>
  )
};

export const CustomClass: Story = {
  render: () => (
    <USWDSButton type='button' className='custom-class'>
      Custom Class
    </USWDSButton>
  )
};

export const Disabled: Story = {
  render: () => (
    <USWDSButton type='button' disabled>
      Disabled Button
    </USWDSButton>
  )
};

export const WithClickHandler: Story = {
  render: () => (
    <USWDSButton type='button' onClick={() => alert('Button clicked!')}>
      Click Me
    </USWDSButton>
  )
};
