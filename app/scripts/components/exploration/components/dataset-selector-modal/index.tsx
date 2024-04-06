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


import { timelineDatasetsAtom } from '../../atoms/datasets';
import {
  allDatasetsWithEnhancedLayers as allDatasets,
  reconcileDatasets,
  datasetLayers,
  findParentDataset
} from '../../data-utils';
import RenderModalHeader from './header';
import ModalContentRender from './content';
import ModalFooterRender from './footer';

import {
  Actions,
  TaxonomyFilterOption,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import { prepareDatasets, sortOptions } from '$components/data-catalog';
import { TAXONOMY_SOURCE, getTaxonomy } from '$utils/veda-data';
import { usePreviousValue } from '$utils/use-effect-previous';


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
  const [datasetsToDisplay, setDatasetsToDisplay] = useState<(DatasetData & {
    countSelectedLayers: number;
  })[] | undefined>();
  const [defaultSelectFilter, setDefaultSelectFilter] = useState<TaxonomyFilterOption>();

  // Store a list of selected datasets and only confirm on save.
  const [selectedIds, setSelectedIds] = useState<string[]>(
    timelineDatasets.map((dataset) => dataset.data.id)
  );

  const prevSelectedIds = usePreviousValue(selectedIds);

  const [exclusionSelected, setExclusionSelected] = useState<boolean>(false);
  
  useEffect(() => {
    setSelectedIds(timelineDatasets.map((dataset) => dataset.data.id));
  }, [timelineDatasets]);

  const onCheck = useCallback((id: string, currentDataset?: DatasetData & {countSelectedLayers: number}) => {
    if (currentDataset) {
      // This layer is part of a dataset that is exclusive
      const exclusiveSource = currentDataset.sourceExclusive;
      const sources = getTaxonomy(currentDataset, TAXONOMY_SOURCE)?.values;
      const sourceIds = sources?.map(source => source.id);
      console.log(`sourceIds: `, sourceIds)
    

      if (exclusiveSource && sourceIds?.includes(exclusiveSource.toLowerCase())) {
        setDefaultSelectFilter({taxonomyType: TAXONOMY_SOURCE, value: exclusiveSource.toLowerCase()});
        setExclusionSelected(true);
      }
      if (!exclusiveSource) {
        setDefaultSelectFilter(undefined);
        setExclusionSelected(false);
      }
    } 
    
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
    if(selectedIds && selectedIds !== prevSelectedIds) {
      let relevantIds: string[] | undefined = undefined;

      const selectedIdsWithParentData = selectedIds.map((selectedId) => {
        const parentData = findParentDataset(selectedId);
        const exclusiveSource = parentData?.sourceExclusive;
        const parentDataSourceValues = parentData?.taxonomy.filter((x) => x.name === 'Source')?.[0]?.values?.map((value) => value.id);
        return {id: selectedId, values: parentDataSourceValues, sourceExclusive: exclusiveSource?.toLowerCase() || ''}
      });
      
      if(exclusionSelected) {
        // Dataset with exclusions selected
        relevantIds = selectedIdsWithParentData.filter((x) => x.values?.includes(x.sourceExclusive)).map((x) => x.id)
      } 
      if(!exclusionSelected) {
        // Dataset with no exclusions selected
        relevantIds = selectedIdsWithParentData.filter((x) => !x.values?.includes(x.sourceExclusive)).map((x) => x.id)
      }

      setSelectedIds((ids) =>
        ids.filter((id) => relevantIds?.includes(id))
      );
    }
    

  }, [exclusionSelected])

  useEffect(() => {
    if (revealed) {
      if (firstRevealRef.current) {
        firstRevealRef.current = false;
        return;
      }
      onAction(Actions.CLEAR);
    }
  }, [revealed]);

  useEffect(() => {
    const datasets = prepareDatasets(allDatasets, {
      search,
      taxonomies,
      sortField,
      sortDir,
      filterLayers: true
    })
    .map(dataset => ({
      ...dataset,
      countSelectedLayers: countOverlap(dataset.layers.map(l => l.id), selectedIds)
    }))

    setDatasetsToDisplay(datasets);
  }, [search, taxonomies, sortField, sortDir, selectedIds])
  
  return (
    <DatasetModal
      id='modal'
      size='xlarge'
      title='Select data layers'
      revealed={revealed}
      onCloseClick={close}
      renderHeadline={() => (
        <RenderModalHeader defaultSelect={defaultSelectFilter}/>
      )}
      content={
        <ModalContentRender 
          search={search} 
          selectedIds={selectedIds} 
          displayDatasets={datasetsToDisplay} 
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