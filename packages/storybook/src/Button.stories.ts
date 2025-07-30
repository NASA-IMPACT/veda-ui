import type { Meta, StoryObj } from '@storybook/react';
// import { Button } from '@teamimpact/veda-ui';

// Example story - you'll need to import actual components from your main package
const meta: Meta = {
  title: 'Example/Button',
  // component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  // args: {
  //   primary: true,
  //   label: 'Button',
  // },
};