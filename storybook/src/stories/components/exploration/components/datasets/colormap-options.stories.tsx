import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { ColormapOptions } from '$components/common/dataset-layer-card/colormap-options';
import { colorMapScale } from '$components/exploration/types.d.ts';

const meta: Meta<typeof ColormapOptions> = {
  title: 'Components/Exploration/ColormapOptions',
  component: ColormapOptions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Simple colormap options component with range slider.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ColormapOptions>;

const ColormapOptionsDemo = () => {
  const [colorMap, setColorMap] = useState('viridis');
  const [colorMapScale, setColorMapScale] = useState<colorMapScale>({
    min: 0,
    max: 100
  });

  return (
    <div>
      <h3>
        Current Range: {colorMapScale.min} to {colorMapScale.max}
      </h3>
      <ColormapOptions
        colorMap={colorMap}
        setColorMap={setColorMap}
        min={0}
        max={100}
        colorMapScale={colorMapScale}
        setColorMapScale={setColorMapScale}
      />
    </div>
  );
};

export const Simple: Story = {
  render: () => <ColormapOptionsDemo />
};
