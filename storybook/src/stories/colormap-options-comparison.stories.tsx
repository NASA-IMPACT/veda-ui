import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColormapOptions } from '$components/common/dataset-layer-card/colormap-options';
import { ColormapOptions as ColormapOptionsCollecticons } from '$components/common/dataset-layer-card-collecticons/colormap-options';
import { colorMapScale } from '$components/exploration/types.d.ts';

const meta: Meta<typeof ColormapOptions> = {
  title:
    'Library Components/Exploration & Analysis/Dataset Layer Card/Colormap Options',
  component: ColormapOptions,
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Colormap options substory of the Dataset Layer Card component with icon comparison. ' +
          'Current uses USWDS icons (Icon.ToggleOn, Icon.ToggleOff) and DropIcon, ' +
          'Baseline uses Collecticons (CollecticonDrop). ' +
          'Test the colormap selection, range slider, and reverse toggle to see the icons in action.'
      }
    }
  }
};

export default meta;

// Mock data for the stories
const ColormapOptionsDemo = ({
  Component
}: {
  Component: typeof ColormapOptions;
}) => {
  const [colorMap, setColorMap] = useState('viridis');
  const [colorMapScale, setColorMapScale] = useState<colorMapScale>({
    min: 0,
    max: 100
  });

  return (
    <div
      style={{ width: '300px', border: '1px solid #ccc', borderRadius: '8px' }}
    >
      <Component
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

export const Current: StoryObj = {
  render: () => <ColormapOptionsDemo Component={ColormapOptions} />,
  parameters: {
    docs: {
      description: {
        story:
          'Current version using USWDS icons (Icon.ToggleOn, Icon.ToggleOff) and DropIcon for the dropdown indicator.'
      }
    }
  }
};

export const Baseline: StoryObj = {
  render: () => <ColormapOptionsDemo Component={ColormapOptionsCollecticons} />,
  parameters: {
    docs: {
      description: {
        story:
          'Baseline version using Collecticons (CollecticonDrop) for the dropdown indicator.'
      }
    }
  }
};
