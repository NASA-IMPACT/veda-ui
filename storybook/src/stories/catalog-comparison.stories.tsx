import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { mockCatalogDatasets } from './mock-catalog-datasets';
import CatalogView from '$components/common/catalog';
import CatalogViewCollecticons from '$components/common/catalog-collecticons';
import { PageMainContent } from '$styles/page';
import { DatasetData } from '$types/veda';

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
    datasets: mockCatalogDatasets as DatasetData[],
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
    datasets: mockCatalogDatasets as DatasetData[],
    enableUSWDSDataCatalog: false,
    onFilterChanges: () => ({
      search: '',
      taxonomies: {},
      onAction: () => {}
    })
  }
};
