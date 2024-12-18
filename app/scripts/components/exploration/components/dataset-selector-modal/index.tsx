import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  reconcileDatasets,
  getLayersFromDataset
} from '../../data-utils-no-faux-module';
import { TimelineDataset } from '../../types.d.ts';

import RenderModalHeader from './header';
import ModalFooterRender from './footer';
import CatalogContent from '$components/common/catalog/catalog-content';
import { useFiltersWithURLAtom } from '$components/common/catalog/controls/hooks/use-filters-with-query';
import { FilterActions } from '$components/common/catalog/utils';

import { DatasetData, LinkProperties, DatasetLayer } from '$types/veda';

const DatasetModal = styled(Modal)`
  z-index: ${themeVal('zIndices.modal')};

  /* Override ModalContents */
  > div {
    display: flex;
    flex-flow: column;
  }

  ${ModalHeader} {
    position: sticky;
    top: ${glsp(-2)};
    z-index: 100;
    background-color: ${themeVal('color.base-50')};
    align-items: start;
    padding-top: ${glsp(1)};
    padding-bottom: ${glsp(1)};
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-200a')};
  }

  ${ModalBody} {
    display: flex;
    flex-flow: column;
    padding-top: ${glsp(2)};
    gap: ${glsp(1)};
  }

  ${ModalFooter} {
    display: flex;
    gap: ${glsp(1)};
    align-items: center;
    position: sticky;
    bottom: ${glsp(-2)};
    z-index: 100;
    background-color: ${themeVal('color.base-50')};
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-200a')};
    > .selection-info {
      margin-right: auto;
    }
  }
`;

interface DatasetSelectorModalProps {
  revealed: boolean;
  close: () => void;
  linkProperties?: LinkProperties;
  datasets: DatasetData[];
  datasetPathName: string;
  timelineDatasets: TimelineDataset[];
  setTimelineDatasets: (datasets: TimelineDataset[]) => void;
}

export function DatasetSelectorModal(props: DatasetSelectorModalProps) {
  const {
    revealed,
    linkProperties,
    datasets,
    datasetPathName,
    timelineDatasets,
    setTimelineDatasets,
    close
  } = props;
  const { LinkElement, pathAttributeKeyName } = linkProperties as {
    LinkElement: React.ElementType;
    pathAttributeKeyName: string;
  };

  const datasetLayers = getLayersFromDataset(datasets);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    timelineDatasets.map((dataset) => dataset.data.id)
  );
  const enhancedDatasetLayers = datasetLayers.flatMap((e) => e);

  // Use Jotai controlled atoms for query parameter manipulation on new E&A page
  const { search: searchTerm, taxonomies, onAction } = useFiltersWithURLAtom();

  useEffect(() => {
    // Reset filter when modal is hidden
    if (!revealed) {
      onAction(FilterActions.CLEAR);
    }
  }, [revealed, onAction]);

  useEffect(() => {
    setSelectedIds(timelineDatasets.map((dataset) => dataset.data.id));
  }, [timelineDatasets]);

  const onConfirm = useCallback(() => {
    setTimelineDatasets(
      reconcileDatasets(selectedIds, enhancedDatasetLayers, timelineDatasets)
    );
    onAction(FilterActions.CLEAR);
    close();
  }, [
    close,
    selectedIds,
    timelineDatasets,
    enhancedDatasetLayers,
    setTimelineDatasets,
    onAction
  ]);

  const linkElementProps = { [pathAttributeKeyName]: datasetPathName };
  return (
    <DatasetModal
      id='modal'
      size='xlarge'
      title='Select data layers'
      revealed={revealed}
      onCloseClick={close}
      renderHeadline={() => <RenderModalHeader />}
      content={
        <CatalogContent
          datasets={datasets}
          search={searchTerm}
          taxonomies={taxonomies}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onAction={onAction}
          filterLayers={true}
          emptyStateContent={
            <>
              <p>There are no datasets to show with the selected filters.</p>
              <p>
                This tool allows the exploration and analysis of time-series
                datasets in raster format. For a comprehensive list of available
                datasets, please visit the{' '}
                <LinkElement {...linkElementProps} target='_blank'>
                  Data Catalog
                </LinkElement>
                .
              </p>
            </>
          }
        />
      }
      footerContent={
        <ModalFooterRender
          selectedDatasetsCount={selectedIds.length}
          close={close}
          onConfirm={onConfirm}
        />
      }
    />
  );
}
export interface DatasetLayerCardProps {
  parent: DatasetData;
  layer: DatasetLayer;
  searchTerm: string;
  selected: boolean;
  onDatasetClick: () => void;
}
