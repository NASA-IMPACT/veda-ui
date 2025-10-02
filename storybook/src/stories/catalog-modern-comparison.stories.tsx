import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { mockCatalogDatasets } from './mock-catalog-datasets';
import CatalogView from '$components/common/catalog';
import { PageMainContent } from '$styles/page';
import { DatasetData } from '$types/veda';

const meta: Meta<typeof CatalogView> = {
  title: 'Library Components/Catalog/Modern Catalog',
  component: CatalogView,
  parameters: {
    layout: 'fullscreen',
    withProviders: true,
    docs: {
      description: {
        component:
          'Modern catalog (enableUSWDSDataCatalog: true). ' +
          'Uses USWDS icons throughout. Select filters to see Icon.Close in filter tags.'
      }
    }
  }
};

export default meta;

// Modern catalog
export const Default: StoryObj<typeof CatalogView> = {
  name: 'Modern Catalog',
  render: (args) => (
    <PageMainContent>
      <CatalogView {...args} />
    </PageMainContent>
  ),
  args: {
    datasets: mockCatalogDatasets as DatasetData[],
    enableUSWDSDataCatalog: true,
    onFilterChanges: () => ({
      search: '',
      taxonomies: {},
      onAction: () => {}
    })
  }
};
