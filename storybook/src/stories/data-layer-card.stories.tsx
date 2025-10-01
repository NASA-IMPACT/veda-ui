import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import DataLayerCardExampleHooked from './data-layer-card-hooked';
import { mockDatasets } from './mock-data';
import DataLayerCardPresentational from '$components/common/dataset-layer-card';

const DataLayerCardExample: React.FC = () => {
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
          <DataLayerCardPresentational
            dataset={dataset}
            isVisible={true}
            setVisible={() => {}}
            colorMap='viridis'
            setColorMap={() => {}}
            colorMapScale={{ min: 0, max: 1 }}
            setColorMapScale={() => {}}
            parentDataset={undefined}
            onRemoveLayer={() => {}}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
            canMoveUp={true}
            canMoveDown={true}
            opacity={1.0}
            onOpacityChange={() => {}}
          />
        </div>
      ))}
    </>
  );
};
const meta: Meta<typeof DataLayerCardExample> = {
  title: 'Library Components/Data Layers/Card',
  component: DataLayerCardExample,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof DataLayerCardExample>;

export const Default: Story = {
  render: () => <DataLayerCardExample />
};

export const Hooked: Story = {
  render: () => <DataLayerCardExampleHooked />
};
