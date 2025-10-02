import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import CatalogView from '$components/common/catalog';
import CatalogViewCollecticons from '$components/common/catalog-collecticons';
import { PageMainContent } from '$styles/page';
import { DatasetData } from '$types/veda';

// Simple mock datasets for comparison
const mockDatasets: Partial<DatasetData>[] = [
  {
    id: 'air-quality',
    name: 'Air Quality Dataset',
    description: 'Sample air quality monitoring data for testing filter tags',
    taxonomy: [
      {
        name: 'Topics',
        values: [{ id: 'air-quality', name: 'Air Quality' }]
      },
      { name: 'Source', values: [{ id: 'nasa', name: 'NASA' }] }
    ],
    layers: []
  },
  {
    id: 'water-quality',
    name: 'Water Quality Dataset',
    description: 'Sample water quality data for testing filter tags',
    taxonomy: [
      { name: 'Topics', values: [{ id: 'water', name: 'Water' }] },
      { name: 'Source', values: [{ id: 'noaa', name: 'NOAA' }] }
    ],
    layers: []
  }
];

const meta: Meta<typeof CatalogView> = {
  title: 'Library Components/Catalog/Legacy Catalog',
  component: CatalogView,
  parameters: {
    layout: 'fullscreen',
    withProviders: true,
    docs: {
      description: {
        component:
          'Legacy catalog (enableUSWDSDataCatalog: false) with icon comparison. ' +
          'Current uses USWDS Icon.Close, Baseline uses CollecticonXmarkSmall. ' +
          'Select filters to see the close icon in filter tags.'
      }
    }
  }
};

export default meta;

// Current legacy catalog with USWDS icons
export const Current: StoryObj<typeof CatalogView> = {
  name: 'Current (USWDS Icons)',
  render: (args) => (
    <PageMainContent>
      <CatalogView {...args} />
    </PageMainContent>
  ),
  args: {
    datasets: mockDatasets as DatasetData[],
    enableUSWDSDataCatalog: false,
    onFilterChanges: () => ({
      search: '',
      taxonomies: {},
      onAction: () => {}
    })
  }
};

// Deprecated legacy catalog with collecticons
export const Deprecated: StoryObj<typeof CatalogViewCollecticons> = {
  name: 'Deprecated (Collecticons)',
  render: (args) => (
    <PageMainContent>
      <CatalogViewCollecticons {...args} />
    </PageMainContent>
  ),
  args: {
    datasets: mockDatasets as DatasetData[],
    enableUSWDSDataCatalog: false,
    onFilterChanges: () => ({
      search: '',
      taxonomies: {},
      onAction: () => {}
    })
  }
};
