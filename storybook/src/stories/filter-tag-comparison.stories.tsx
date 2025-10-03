import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import FilterTag from '$components/common/catalog/filter-tag';
import FilterTagCollecticons from '$components/common/catalog/filter-tag.collecticons';
import { OptionItem } from '$components/common/form/checkable-filter';

interface FilterTagProps {
  item: OptionItem;
  onClick: (item: OptionItem) => void;
}

const meta: Meta<typeof FilterTag> = {
  title: 'Library Components/Catalog/Components/Filter Tag',
  component: FilterTag,
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Filter tag component used in catalog with icon comparison. ' +
          'Current uses USWDS Icon.Close, Baseline uses CollecticonXmarkSmall. ' +
          'Click the X to remove a filter tag.'
      }
    }
  }
};

export default meta;

const mockFilterTags: OptionItem[] = [
  { taxonomy: 'Topics', id: 'air-quality', name: 'Air Quality' },
  { taxonomy: 'Topics', id: 'climate', name: 'Climate' },
  { taxonomy: 'Topics', id: 'oceans', name: 'Oceans' },
  { taxonomy: 'Project Categories', id: 'research', name: 'Research' },
  { taxonomy: 'Data Type', id: 'satellite', name: 'Satellite Data' }
];

// Helper component to manage filter tags state
const FilterTagsDemo = ({
  Component,
  title
}: {
  Component: React.ComponentType<FilterTagProps>;
  title: string;
}) => {
  const [tags, setTags] = useState<OptionItem[]>(mockFilterTags);

  const handleRemoveTag = (itemToRemove: OptionItem) => {
    setTags((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.taxonomy === itemToRemove.taxonomy
          )
      )
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h3>{title}</h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '12px',
          marginBottom: '12px'
        }}
      >
        {tags.map((tag) => (
          <Component
            key={`${tag.taxonomy}-${tag.id}`}
            item={tag}
            onClick={handleRemoveTag}
          />
        ))}
      </div>
      {tags.length === 0 && (
        <p style={{ color: 'gray', fontStyle: 'italic' }}>
          All filter tags removed. Refresh the story to reset.
        </p>
      )}
    </div>
  );
};

// Current version with USWDS icons
export const Current: StoryObj<typeof FilterTag> = {
  name: 'Current (USWDS Icons)',
  render: () => (
    <FilterTagsDemo
      Component={FilterTag}
      title='Filter Tags - Current (USWDS Icon.Close)'
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Current implementation using USWDS Icon.Close for the close button.'
      }
    }
  }
};

// Baseline version with collecticons
export const Baseline: StoryObj<typeof FilterTagCollecticons> = {
  name: 'Baseline (Collecticons)',
  render: () => (
    <FilterTagsDemo
      Component={FilterTagCollecticons}
      title='Filter Tags - Baseline (CollecticonXmarkSmall)'
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Baseline implementation using CollecticonXmarkSmall for the close button. Click tags to see icon differences.'
      }
    }
  }
};
