import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { mockDatasets } from './mock-data';
import DataLayerCard from '$components/common/dataset-layer-card';
import DataLayerCardCollecticons from '$components/common/dataset-layer-card-collecticons';

const meta: Meta<typeof DataLayerCard> = {
  title: 'Library Components/Exploration & Analysis/Dataset Layer Card',
  component: DataLayerCard,
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Dataset layer card component with icon comparison. ' +
          'Current uses USWDS icons (Icon.Info, Icon.Visibility, Icon.VisibilityOff, Icon.ExpandMore, Icon.ExpandLess), ' +
          'Baseline uses Collecticons (CollecticonCircleInformation, CollecticonEye, CollecticonEyeDisabled, CollecticonChevronDown, CollecticonChevronUp). ' +
          'Click the info button, visibility toggle, and expand/collapse controls to see the icons in action.'
      }
    }
  }
};

export default meta;

// Mock data for dataset-card component
const mockDatasetCardProps = {
  dataset: mockDatasets[0], // Use first mock dataset
  isVisible: true,
  setVisible: () => {},
  colorMap: 'viridis',
  setColorMap: () => {},
  colorMapScale: { min: 0, max: 100 },
  setColorMapScale: () => {},
  parentDataset: undefined,
  onRemoveLayer: () => {},
  onMoveUp: () => {},
  onMoveDown: () => {},
  canMoveUp: true,
  canMoveDown: true,
  opacity: 0.8,
  onOpacityChange: () => {}
};

// Current version with USWDS icons
export const Current: StoryObj<typeof DataLayerCard> = {
  name: 'Current (USWDS Icons)',
  render: () => {
    const [isVisible, setIsVisible] = useState(true);
    const [colorMap, setColorMap] = useState('viridis');
    const [colorMapScale, setColorMapScale] = useState({ min: 0, max: 100 });
    const [opacity, setOpacity] = useState(0.8);

    const props = {
      ...mockDatasetCardProps,
      isVisible,
      setVisible: setIsVisible,
      colorMap,
      setColorMap,
      colorMapScale,
      setColorMapScale,
      opacity,
      onOpacityChange: setOpacity
    };

    return (
      <div style={{ width: '400px', maxWidth: '100%' }}>
        <DataLayerCard {...props} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Current implementation using USWDS icons: Icon.Info, Icon.Visibility, Icon.VisibilityOff, Icon.ExpandMore, Icon.ExpandLess.'
      }
    }
  }
};

// Baseline version with collecticons
export const Baseline: StoryObj<typeof DataLayerCardCollecticons> = {
  name: 'Baseline (Collecticons)',
  render: () => {
    const [isVisible, setIsVisible] = useState(true);
    const [colorMap, setColorMap] = useState('viridis');
    const [colorMapScale, setColorMapScale] = useState({ min: 0, max: 100 });
    const [opacity, setOpacity] = useState(0.8);

    const props = {
      ...mockDatasetCardProps,
      isVisible,
      setVisible: setIsVisible,
      colorMap,
      setColorMap,
      colorMapScale,
      setColorMapScale,
      opacity,
      onOpacityChange: setOpacity
    };

    return (
      <div style={{ width: '400px', maxWidth: '100%' }}>
        <DataLayerCardCollecticons {...props} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Baseline implementation using Collecticons: CollecticonCircleInformation, CollecticonEye, CollecticonEyeDisabled, CollecticonChevronDown, CollecticonChevronUp. Click the buttons to see icon differences.'
      }
    }
  }
};
