import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import SearchField from '$components/common/search-field';
import SearchFieldCollecticons from '$components/common/search-field.collecticons';

const meta: Meta<typeof SearchField> = {
  title: 'Library Components/Search/Search Field',
  component: SearchField,
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Search field component with icon comparison. ' +
          'Current uses USWDS Icon.Search and Icon.Close, Baseline uses CollecticonMagnifierLeft and CollecticonDiscXmark. ' +
          'Type to see the clear button with Icon.Close.'
      }
    }
  }
};

export default meta;

// Current version with USWDS icons
export const Current: StoryObj<typeof SearchField> = {
  name: 'Current (USWDS Icons)',
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '400px' }}>
        <SearchField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    size: 'medium',
    placeholder: 'Search datasets...'
  }
};

// Deprecated version with collecticons
export const Deprecated: StoryObj<typeof SearchFieldCollecticons> = {
  name: 'Deprecated (Collecticons)',
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '400px' }}>
        <SearchFieldCollecticons {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    size: 'medium',
    placeholder: 'Search datasets...'
  }
};
