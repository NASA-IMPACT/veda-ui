import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { mockDatasets } from './mock-data';
import DataLayerCardOptionsMenu from '$components/common/dataset-layer-card/layer-options-menu';

const DataLayerCardOptionMenuExample: React.FC = () => {
  return (
    <>
      {mockDatasets.map((dataset) => (
        <div
          key={dataset.data.id}
          style={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '0.5rem',
            background: 'white'
          }}
        >
          <DataLayerCardOptionsMenu
            dataset={dataset}
            opacity={1.0}
            canMoveUp={true}
            canMoveDown={true}
            onRemoveLayer={() => {}}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
            onOpacityChange={() => {}}
          />
        </div>
      ))}
    </>
  );
};
const meta: Meta<typeof DataLayerCardOptionMenuExample> = {
  title: 'Components/DataLayerCardOptionsMenu',
  component: DataLayerCardOptionMenuExample,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof DataLayerCardOptionMenuExample>;

export const Default: Story = {
  render: () => <DataLayerCardOptionMenuExample />
};

export const Other: Story = {
  render: () => <DataLayerCardOptionMenuExample />
};
