import React from 'react';
import { allDatasetsWithEnhancedLayers } from '$components/exploration/data-utils';
import DataCatalog from '$components/data-catalog/index-v2';

// @VEDA2-REFACTOR-WORK

// @NOTE: This container component serves as a wrapper for the purpose of data management, this is ONLY to support current instances. 
// veda2 instances can just use the direct component, 'DataCatalog', and manage data directly in their page views

export default function DataCatalogContainer() {
  return (
    <>
      <DataCatalog datasets={allDatasetsWithEnhancedLayers} />
    </>
  );
}