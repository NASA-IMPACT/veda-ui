import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';

import { DatasetData, DatasetLayer } from 'veda';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';


import { Link } from 'react-router-dom';
import { timelineDatasetsAtom } from '../../atoms/datasets';
import {
  reconcileDatasets,
  datasetLayers,
  allDatasets
} from '../../data-utils';
import RenderModalHeader from './header';
import ModalFooterRender from './footer';

import CatalogContent from '$components/common/catalog/catalog-content';
import { DATASETS_PATH } from '$utils/routes';
import { CatalogViewAction, onCatalogAction } from '$components/common/catalog/utils';

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
}

export function DatasetSelectorModal(props: DatasetSelectorModalProps) {
  const { revealed, close } = props;

  const [timelineDatasets, setTimelineDatasets] = useAtom(timelineDatasetsAtom);

  const [searchTerm, setSearchTerm] = useState('');
  const [taxonomies, setTaxonomies] = useState({});
  // Store a list of selected datasets and only confirm on save.
  const [selectedIds, setSelectedIds] = useState<string[]>(
    timelineDatasets.map((dataset) => dataset.data.id)
  );

  useEffect(() => {
    setSelectedIds(timelineDatasets.map((dataset) => dataset.data.id));
  }, [timelineDatasets]);

  const onConfirm = useCallback(() => {
    setTimelineDatasets(
      reconcileDatasets(selectedIds, datasetLayers, timelineDatasets)
    );
    close();
  }, [close, selectedIds, timelineDatasets, setTimelineDatasets]);

  const onAction = useCallback<CatalogViewAction>(
    (action, value) => onCatalogAction(action, value, taxonomies, setSearchTerm, setTaxonomies),
    [setTaxonomies, taxonomies]
  );

  return (
    <DatasetModal
      id='modal'
      size='xlarge'
      title='Select data layers'
      revealed={revealed}
      onCloseClick={close}
      renderHeadline={() => (
        <RenderModalHeader />
      )}
      content={
        <CatalogContent
          datasets={allDatasets}
          search={searchTerm}
          taxonomies={taxonomies}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onAction={onAction}
          filterLayers={true}
          emptyStateContent={
            <>
              <p>There are no datasets to show with the selected filters.</p>
              <p>This tool allows the exploration and analysis of time-series datasets in raster format. For a comprehensive list of available datasets, please visit the <Link to={DATASETS_PATH} target='_blank'>Data Catalog</Link>.</p>
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