import React from 'react';
import { getString } from 'veda';
import { allDatasets } from '$components/exploration/data-utils';
import DataCatalog from '$components/data-catalog';
import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { FeaturedDatasets } from '$components/common/featured-slider-section';

/**
 * @VEDA2-REFACTOR-WORK
 * 
 * @NOTE: This container component serves as a wrapper for the purpose of data management, this is ONLY to support current instances. 
 * veda2 instances can just use the direct component, 'DataCatalog', and manage data directly in their page views
 */

export default function DataCatalogContainer() {
  return (
    <PageMainContent>
      <LayoutProps
        title='Data Catalog'
        description={getString('dataCatalogBanner').other}
      />
      <PageHero
        title='Data Catalog'
        description={getString('dataCatalogBanner').other}
      />
      <FeaturedDatasets />
      <DataCatalog
        datasets={allDatasets}
      />
    </PageMainContent>
  );
}