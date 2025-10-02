import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import CheckableFiltersLegacy from '$components/common/form/checkable-filter-legacy';
import CheckableFiltersLegacyCollecticons from '$components/common/form/checkable-filter-legacy/index.collecticons';
import { OptionItem } from '$components/common/form/checkable-filter';

const meta: Meta<typeof CheckableFiltersLegacy> = {
  title: 'Library Components/Catalog/Components/Checkable Filter Legacy',
  component: CheckableFiltersLegacy,
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Checkable filter component used in legacy catalog with icon comparison. ' +
          'Current uses USWDS Icon.ExpandMore/ExpandLess, Baseline uses CollecticonChevronDown/Up. ' +
          'Click the title to expand/collapse and see the chevron icons.'
      }
    }
  }
};

export default meta;

const mockItems: OptionItem[] = [
  { taxonomy: 'Topics', id: 'air-quality', name: 'Air Quality' },
  { taxonomy: 'Topics', id: 'climate', name: 'Climate' },
  { taxonomy: 'Topics', id: 'oceans', name: 'Oceans' },
  { taxonomy: 'Topics', id: 'fire', name: 'Fire' }
];

// Current version with USWDS icons
export const Current: StoryObj<typeof CheckableFiltersLegacy> = {
  name: 'Current (USWDS Icons)',
  render: (args) => {
    const [selected, setSelected] = useState<OptionItem[]>([]);

    const handleChange = (item: OptionItem) => {
      setSelected((prev) => {
        const exists = prev.some(
          (s) => s.id === item.id && s.taxonomy === item.taxonomy
        );
        if (exists) {
          return prev.filter(
            (s) => !(s.id === item.id && s.taxonomy === item.taxonomy)
          );
        }
        return [...prev, item];
      });
    };

    return (
      <div style={{ width: '320px' }}>
        <CheckableFiltersLegacy
          {...args}
          globallySelected={selected}
          onChanges={handleChange}
        />
      </div>
    );
  },
  args: {
    title: 'Topics',
    items: mockItems,
    openByDefault: true
  }
};

// Deprecated version with collecticons
export const Deprecated: StoryObj<typeof CheckableFiltersLegacyCollecticons> = {
  name: 'Deprecated (Collecticons)',
  render: (args) => {
    const [selected, setSelected] = useState<OptionItem[]>([]);

    const handleChange = (item: OptionItem) => {
      setSelected((prev) => {
        const exists = prev.some(
          (s) => s.id === item.id && s.taxonomy === item.taxonomy
        );
        if (exists) {
          return prev.filter(
            (s) => !(s.id === item.id && s.taxonomy === item.taxonomy)
          );
        }
        return [...prev, item];
      });
    };

    return (
      <div style={{ width: '320px' }}>
        <CheckableFiltersLegacyCollecticons
          {...args}
          globallySelected={selected}
          onChanges={handleChange}
        />
      </div>
    );
  },
  args: {
    title: 'Topics',
    items: mockItems,
    openByDefault: true
  }
};
