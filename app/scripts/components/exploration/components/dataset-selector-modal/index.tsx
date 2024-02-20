import React, { useCallback, useEffect, useMemo, useState } from 'react';
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


import { timelineDatasetsAtom } from '../../atoms/datasets';
import {
  allDatasetsWithEnhancedLayers as allDatasets,
  reconcileDatasets,
  datasetLayers
} from '../../data-utils';
import RenderModalHeader from './header';
import ModalContentRender from './content';
import ModalFooterRender from './footer';

import {
  Actions,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import { prepareDatasets, sortOptions } from '$components/data-catalog';


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
    padding-top: ${glsp(2)};
    padding-bottom: ${glsp(1)};
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-200a')};
  }

  ${ModalBody} {
    height: 100%;
    min-height: 100%;
    overflow-y: auto;
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

// Filter elements in arr1 that are also included in arr2
function countOverlap(arr1, arr2) {
  const commonElements = arr1.filter(element => arr2.includes(element));
  return commonElements.length;
}
  

export function DatasetSelectorModal(props: DatasetSelectorModalProps) {
  const { revealed, close } = props;

  const [timelineDatasets, setTimelineDatasets] = useAtom(timelineDatasetsAtom);

  // Store a list of selected datasets and only confirm on save.
  const [selectedIds, setSelectedIds] = useState<string[]>(
    timelineDatasets.map((dataset) => dataset.data.id)
  );

  useEffect(() => {
    setSelectedIds(timelineDatasets.map((dataset) => dataset.data.id));
  }, [timelineDatasets]);

  const onCheck = useCallback((id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  }, []);

  const onConfirm = useCallback(() => {
    // Reconcile selectedIds with datasets.
    setTimelineDatasets(
      reconcileDatasets(selectedIds, datasetLayers, timelineDatasets)
    );
    close();
  }, [close, selectedIds, timelineDatasets, setTimelineDatasets]);

  const controlVars = useBrowserControls({
    sortOptions
  });
  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  // Clear filters when the modal is revealed.
  const firstRevealRef = React.useRef(true);

  useEffect(() => {
    if (revealed) {
      if (firstRevealRef.current) {
        firstRevealRef.current = false;
        return;
      }
      onAction(Actions.CLEAR);
    }
  }, [revealed]);

  // Filtered datasets for modal display
  const displayDatasets = useMemo<(DatasetData & {countSelectedLayers: number})[]>(
    () =>
      // TODO: Move function from data-catalog once that page is removed.
      prepareDatasets(allDatasets, {
        search,
        taxonomies,
        sortField,
        sortDir,
        filterLayers: true
      })
      .map(dataset => ({
        ...dataset,
        countSelectedLayers: countOverlap(dataset.layers.map(l => l.id), selectedIds)
      })),
    [search, taxonomies, sortField, sortDir, selectedIds]
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
        <ModalContentRender 
          search={search} 
          selectedIds={selectedIds} 
          displayDatasets={displayDatasets} 
          onCheck={onCheck}
        /> 
      }
      footerContent={
        <ModalFooterRender 
          selectedIds={selectedIds} 
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