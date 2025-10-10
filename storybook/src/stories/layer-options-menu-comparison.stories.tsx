import React, { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { mockDatasets } from './mock-data';
import LayerMenuOptions from '$components/common/dataset-layer-card/layer-options-menu';
import LayerMenuOptionsCollecticons from '$components/common/dataset-layer-card-collecticons/layer-options-menu';

const meta: Meta = {
  title:
    'Library Components/Exploration & Analysis/Dataset Layer Card/Layer Options Menu',
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Layer options menu substory of the Dataset Layer Card component with icon comparison. ' +
          'Current uses USWDS icons (Icon.MoreVert, Icon.ArrowUpward, Icon.ArrowDownward, Icon.Share, Icon.Close) and DropIcon, ' +
          'Baseline uses Collecticons (CollecticonEllipsisVertical, CollecticonArrowUp, CollecticonArrowDown, CollecticonShare, CollecticonXmarkSmall, CollecticonDrop). ' +
          'Menu contents are exposed for easy review without requiring clicks to open.'
      }
    }
  }
};

export default meta;

const mockDataset = mockDatasets[0];

const LayerMenuOptionsWithRef = React.forwardRef<any, any>((props, ref) => {
  const componentRef = useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    open: () => {
      if (componentRef.current) {
        const trigger = componentRef.current.querySelector(
          '[data-drop-el="trigger"]'
        ) as HTMLElement;
        trigger?.click();
      }
    }
  }));

  return (
    <div ref={componentRef}>
      <LayerMenuOptions {...props} />
    </div>
  );
});

LayerMenuOptionsWithRef.displayName = 'LayerMenuOptionsWithRef';

const LayerMenuOptionsCollecticonsWithRef = React.forwardRef<any, any>(
  (props, ref) => {
    const componentRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      open: () => {
        if (componentRef.current) {
          const trigger = componentRef.current.querySelector(
            '[data-drop-el="trigger"]'
          ) as HTMLElement;
          trigger?.click();
        }
      }
    }));

    return (
      <div ref={componentRef}>
        <LayerMenuOptionsCollecticons {...props} />
      </div>
    );
  }
);

LayerMenuOptionsCollecticonsWithRef.displayName =
  'LayerMenuOptionsCollecticonsWithRef';

const LayerMenuOptionsDemo = ({
  Component
}: {
  Component: React.ComponentType<any>;
}) => {
  const [opacity, setOpacity] = useState(0.8);
  const dropdownRef = useRef<any>(null);

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
  };

  const handleMoveUp = () => {};

  const handleMoveDown = () => {};

  const handleRemoveLayer = () => {};

  useEffect(() => {
    const timer = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current.open();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        minWidth: '300px'
      }}
    >
      <h4 style={{ marginBottom: '16px' }}>Layer: {mockDataset.data.name}</h4>

      <div style={{ marginBottom: '16px' }}>
        <Component
          ref={dropdownRef}
          dataset={mockDataset}
          canMoveUp={true}
          canMoveDown={true}
          opacity={opacity}
          onOpacityChange={handleOpacityChange}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemoveLayer={handleRemoveLayer}
        />
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        ✅ Dropdown auto-opens on mount for easy icon comparison
      </div>
    </div>
  );
};

export const Current: StoryObj = {
  render: () => <LayerMenuOptionsDemo Component={LayerMenuOptionsWithRef} />,
  parameters: {
    docs: {
      description: {
        story:
          'Current version using USWDS icons (Icon.MoreVert, Icon.ArrowUpward, Icon.ArrowDownward, Icon.Share, Icon.Close) and DropIcon. Dropdown auto-opens for easy comparison.'
      }
    }
  }
};

export const Baseline: StoryObj = {
  render: () => (
    <LayerMenuOptionsDemo Component={LayerMenuOptionsCollecticonsWithRef} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Baseline version using Collecticons (CollecticonEllipsisVertical, CollecticonArrowUp, CollecticonArrowDown, CollecticonShare, CollecticonXmarkSmall, CollecticonDrop). Dropdown auto-opens for easy comparison.'
      }
    }
  }
};
