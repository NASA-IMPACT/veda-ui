import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { DatasetData } from 'veda';
import { useNavigate } from 'react-router-dom';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import TextHighlight from '../text-highlight';
import { CollecticonDatasetLayers } from '../icons/dataset-layers';
import prepareDatasets from './prepare-datasets';
import FiltersControl from './filters-control';
import { CatalogCard } from './catalog-card';
import CatalogTagsContainer from './catalog-tags';

import { CatalogActions } from './utils';
import { CardList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { DATASETS_PATH } from '$utils/routes';
import {
  getTaxonomyByIds,
  generateTaxonomies,
  getTaxonomy,
  TAXONOMY_SOURCE,
} from '$utils/veda-data';
import { OptionItem } from '$components/common/form/checkable-filter';
import { findParentDataset, getAllDatasetsWithEnhancedLayers } from '$components/exploration/data-utils';
import { Pill } from '$styles/pill';
import { usePreviousValue } from '$utils/use-effect-previous';

const EXCLUSIVE_SOURCE_WARNING = "Can only be analyzed with layers from the same source";

export interface CatalogContentProps {
  datasets: DatasetData[];
  selectedIds?: string[];
  setSelectedIds?: (selectedIds: string[]) => void;
  filterLayers?: boolean;
  emptyStateContent?: React.ReactNode;
  search: string | null;
  taxonomies: Record<string, string[]> | null;
  onAction: (action: CatalogActions, value?: any) => void;
}

const DEFAULT_SORT_OPTION = 'asc';

function CatalogContent({
  datasets,
  selectedIds,
  setSelectedIds,
  filterLayers,
  emptyStateContent,
  search,
  taxonomies,
  onAction,
}: CatalogContentProps) {
  const [exclusiveSourceSelected, setExclusiveSourceSelected] = useState<string | null>(null);
  const isSelectable = selectedIds !== undefined;

  const navigate = useNavigate();

  const datasetTaxonomies = generateTaxonomies(datasets);
  const urlTaxonomyItems = taxonomies ? Object.entries(taxonomies).map(([key, val]) => getTaxonomyByIds(key, val, datasetTaxonomies)).flat() : [];

  const allDatasetsWithEnhancedLayers = useMemo(() => getAllDatasetsWithEnhancedLayers(datasets), [datasets]);

  const [datasetsToDisplay, setDatasetsToDisplay] = useState<DatasetData[]>(
    prepareDatasets(allDatasetsWithEnhancedLayers, {
    search,
    taxonomies,
    sortField: DEFAULT_SORT_OPTION,
    sortDir: DEFAULT_SORT_OPTION,
    filterLayers: filterLayers ?? false
  }));

  const [selectedFilters, setSelectedFilters] = useState<OptionItem[]>(urlTaxonomyItems);
  const [clearedTagItem, setClearedTagItem] = useState<OptionItem>();

  const prevSelectedFilters = usePreviousValue(selectedFilters) ?? [];

  // Handlers
  const updateSelectedFilters = useCallback((item: OptionItem, action: 'add' | 'remove') => {
    if (action == 'add') {
      setSelectedFilters([...selectedFilters, item]);
    }

    if (action == 'remove') {
      setSelectedFilters(selectedFilters.filter((selected) => selected.id !== item.id));
    }

    onAction(CatalogActions.TAXONOMY_MULTISELECT, { key: item.taxonomy, value: item.id });
  }, [setSelectedFilters, selectedFilters, onAction]);

  const handleClearTag = useCallback((item: OptionItem) => {
    setSelectedFilters(selectedFilters.filter((selected) => selected !== item));
    setClearedTagItem(item);
  }, [selectedFilters]);

  const handleClearTags = useCallback(() => {
    setSelectedFilters([]);
    setExclusiveSourceSelected(null);
    onAction(CatalogActions.CLEAR_TAXONOMY);
  }, [onAction]);

  useEffect(() => {
    if (clearedTagItem && (selectedFilters.length == prevSelectedFilters.length - 1)) {
      onAction(CatalogActions.TAXONOMY_MULTISELECT, { key: clearedTagItem.taxonomy, value: clearedTagItem.id});
      setClearedTagItem(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, clearedTagItem]);

  useEffect(() => {
    if (!selectedFilters.length) {
      onAction(CatalogActions.CLEAR_TAXONOMY);
      if (!isSelectable) {
        navigate(DATASETS_PATH);
      }
    }

    setExclusiveSourceSelected(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  const getSelectedIdsWithParentData = (selectedIds) => {
    return selectedIds.map((selectedId: string) => {
      const parentData = findParentDataset(selectedId);
      const exclusiveSource = parentData?.sourceExclusive;
      const parentDataSourceValues = parentData?.taxonomy.filter((x) => x.name === 'Source')[0]?.values.map((value) => value.id);
      return { id: selectedId, values: parentDataSourceValues, sourceExclusive: exclusiveSource?.toLowerCase() ?? '' };
    });
  };

  const filterRelevantIdsBasedOnExclusion = (selectedIdsWithParentData, exclusionSelected) => {
    if (exclusionSelected) {
      return selectedIdsWithParentData.filter((x) => x.values?.includes(x.sourceExclusive)).map((x) => x.id);
    } else {
      return selectedIdsWithParentData.filter((x) => !x.values?.includes(x.sourceExclusive)).map((x) => x.id);
    }
  };

  const onCardSelect = useCallback((id: string, currentDataset: DatasetData) => {
    if (!setSelectedIds || selectedIds === undefined) return;

    const exclusiveSource = currentDataset.sourceExclusive?.toLowerCase();
    const sources = getTaxonomy(currentDataset, TAXONOMY_SOURCE)?.values;
    const sourceIds = sources?.map(source => source.id);

    const newSelectedIds = selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id];

    const selectedIdsWithParentData = getSelectedIdsWithParentData(newSelectedIds);

    if (exclusiveSource && sourceIds?.includes(exclusiveSource)) {
      setExclusiveSourceSelected(exclusiveSource);
    } else {
      setExclusiveSourceSelected(null);
    }

    const relevantIdsBasedOnExclusion = filterRelevantIdsBasedOnExclusion(selectedIdsWithParentData, exclusiveSource && sourceIds?.includes(exclusiveSource));

    setSelectedIds(newSelectedIds.filter((id) => relevantIdsBasedOnExclusion.includes(id)));
  }, [selectedIds, setSelectedIds]);

  useEffect(() => {
    const updated = prepareDatasets(allDatasetsWithEnhancedLayers, {
      search,
      taxonomies,
      sortField: DEFAULT_SORT_OPTION,
      sortDir: DEFAULT_SORT_OPTION,
      filterLayers: filterLayers ?? false
    });
    setDatasetsToDisplay(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, taxonomies, search]);

  const getSelectedLayerCount = (dataset) => {
    return dataset.layers.filter((layer) => selectedIds?.includes(layer.id)).length;
  };

  return (
    <Content>
      <FiltersControl
        search={search}
        onAction={onAction}
        taxonomiesOptions={datasetTaxonomies}
        onFilterChange={updateSelectedFilters}
        clearedTagItem={clearedTagItem}
        setClearedTagItem={handleClearTag}
        allSelected={selectedFilters}
        exclusiveSourceSelected={exclusiveSourceSelected}
        customTopOffset={isSelectable ? 50 : 0}
        openByDefault={isSelectable ? false : true}
      />
      <Catalog>
        <CatalogTagsContainer
          allSelectedFilters={selectedFilters}
          urlTaxonomyItems={urlTaxonomyItems}
          handleClearTag={handleClearTag}
          handleClearTags={handleClearTags}
        />
        {datasetsToDisplay.length ? (
          isSelectable ? (
            <Cards>
              {datasetsToDisplay.map((currentDataset) => (
                <div key={currentDataset.id}>
                  <div>
                    <Headline>
                      <ParentDatasetTitle>
                        <CollecticonDatasetLayers /> {currentDataset.name}
                        {getSelectedLayerCount(currentDataset) > 0 && (
                          <SelectedCard>
                            <span>{getSelectedLayerCount(currentDataset)} selected</span>
                          </SelectedCard>
                        )}
                      </ParentDatasetTitle>
                      {currentDataset.sourceExclusive && (
                        <WarningPill variation='warning'>
                          {EXCLUSIVE_SOURCE_WARNING}
                        </WarningPill>
                      )}
                    </Headline>
                    <Paragraph>
                      <TextHighlight
                        value={search}
                        disabled={search.length < 3}
                      >
                        {currentDataset.description}
                      </TextHighlight>
                    </Paragraph>
                  </div>
                  <Cards>
                    {currentDataset.layers.map((datasetLayer) => (
                      <li key={datasetLayer.id}>
                        <CatalogCard
                          searchTerm={search}
                          layer={datasetLayer}
                          dataset={currentDataset}
                          selectable={true}
                          selected={selectedIds.includes(datasetLayer.id)}
                          onDatasetClick={() => onCardSelect(datasetLayer.id, currentDataset)}
                        />
                      </li>
                    ))}
                  </Cards>
                </div>
              ))}
            </Cards>
          ) : (
            <Cards>
              {datasetsToDisplay.map((d) => (
                <li key={d.id}>
                  <CatalogCard dataset={d} searchTerm={search} />
                </li>
              ))}
            </Cards>
          )
        ) : (
          <EmptyState>
            {emptyStateContent ?? (
              <p>There are no datasets to show with the selected filters.</p>
            )}
          </EmptyState>
        )}
      </Catalog>
    </Content>
  );

}

export default CatalogContent;

const WarningPill = styled(Pill)`
  margin-left: 8px;
`;

export const ParentDatasetTitle = styled.h2<{size?: string}>`
  color: ${themeVal('color.primary')};
  text-align: left;
  font-size: ${(props => props.size=='small'? '0.75rem': '1rem')};
  line-height: 0.75rem;
  font-weight: normal; ${(props => props.size=='small'? '400': 'normal')};
  display: flex;
  min-width: 0;
  justify-content: center;
  gap: 0.1rem;
  align-items: center;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    fill: ${themeVal('color.primary')};
    min-width: ${(props => props.size=='small' ? '1rem': 'auto')};
  }
`;

const Headline = styled.div`
  display: flex;
  gap: ${glsp(1)};
  flex-direction: column;
  align-items: baseline;
  margin-bottom: ${glsp(1)};
`;

const Content = styled.div`
  display: flex;
  margin-bottom: 8rem;
  position: relative;
  gap: 24px;
`;

const Catalog = styled.div`
  width: 100%;
`;

const Cards = styled(CardList)`
  padding: ${glsp(1)} 0;

  &:first-of-type {
    padding-top: 0;
  }
`;

const Paragraph = styled.p`
  margin-bottom: ${glsp(1)};
`;

const EmptyState = styled(EmptyHub)`
  border: none;
  text-align: center;
`;

const SelectedCard = styled.div`
  background-color: ${themeVal('color.primary')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: 0 ${glsp(0.5)};
  color: ${themeVal('color.surface')};
  margin-left: ${glsp(0.5)};
`;