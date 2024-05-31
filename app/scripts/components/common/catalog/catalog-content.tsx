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
import { CatalogCardSelectable } from './catalog-card-selectable';
import {
  Actions, useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import { usePreviousValue } from '$utils/use-effect-previous';

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

export const sortOptions = [{ id: 'name', name: 'Name' }];
const exclusiveSourceWarning = "Can only be analyzed with layers from the same source";

export interface CatalogContentProps {
  datasets: DatasetData[];
  isSelectable?: boolean;
  onSelectedCardsChange?: (selectedIds: string[]) => void;
  filterLayers?: boolean;
  preselectedIds?: string[];
}

function CatalogContent({
  datasets,
  isSelectable = false,
  preselectedIds = [],
  onSelectedCardsChange,
  filterLayers
}: CatalogContentProps) {
  const [exclusionSelected, setExclusionSelected] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([...preselectedIds]);

  const controlVars = useBrowserControls({
    sortOptions
  });

  const navigate = useNavigate();

  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const datasetTaxonomies = generateTaxonomies(datasets);

  const urlTaxonomyItems = taxonomies ? Object.entries(taxonomies).map(([key, val]) => getTaxonomyByIds(key, val, datasetTaxonomies)).flat() : [];

  const allDatasetsWithEnhancedLayers = useMemo(() => getAllDatasetsWithEnhancedLayers(datasets), [datasets]);

  const prevSelectedIds = usePreviousValue(selectedIds);

  const [datasetsToDisplay, setDatasetsToDisplay] = useState<DatasetData[]>(
    prepareDatasets(allDatasetsWithEnhancedLayers, {
    search,
    taxonomies,
    sortField,
    sortDir,
    filterLayers: false
  }));

  const [allSelectedFilters, setAllSelectedFilters] = useState<OptionItem[]>(urlTaxonomyItems);
  const [clearedTagItem, setClearedTagItem] = useState<OptionItem>();

  const prevSelectedFilters = usePreviousValue(allSelectedFilters) ?? [];

  // Handlers
  const handleChangeAllSelectedFilters = useCallback((item: OptionItem, action: 'add' | 'remove') => {
    setAllSelectedFilters((prevFilters) =>
      action === 'add'
        ? [...prevFilters, item]
        : prevFilters.filter((selected) => selected.id !== item.id)
    );
    onAction(Actions.TAXONOMY_MULTISELECT, { key: item.taxonomy, value: item.id });
  }, [onAction]);

  const handleClearTag = useCallback((item: OptionItem) => {
    setAllSelectedFilters((prevFilters) => prevFilters.filter((selected) => selected !== item));
    setClearedTagItem(item);
  }, []);

  const handleClearTags = useCallback(() => {
    setAllSelectedFilters([]);
  }, []);

  useEffect(() => {
    if (clearedTagItem && (allSelectedFilters.length == prevSelectedFilters.length - 1)) {
      onAction(Actions.TAXONOMY_MULTISELECT, { key: clearedTagItem.taxonomy, value: clearedTagItem.id});
      setClearedTagItem(undefined);
    }
  }, [allSelectedFilters, clearedTagItem]);

  useEffect(() => {
    if(!allSelectedFilters.length) {
      onAction(Actions.CLEAR);

      if (!isSelectable) {
        navigate(DATASETS_PATH);
      }
    }
  }, [allSelectedFilters]);

  const onCheck = useCallback((id: string, currentDataset?: DatasetData) => {
    if (currentDataset) {
      // This layer is part of a dataset that is exclusive
      const exclusiveSource = currentDataset.sourceExclusive?.toLowerCase();
      const sources = getTaxonomy(currentDataset, TAXONOMY_SOURCE)?.values;
      const sourceIds = sources?.map(source => source.id);

      if (exclusiveSource && sourceIds?.includes(exclusiveSource)) {
        setExclusionSelected(true);
      } else {
        setExclusionSelected(false);
      }
    }

    setSelectedIds((ids) => {
        const newSelectedIds = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
        if (onSelectedCardsChange) {
            onSelectedCardsChange(newSelectedIds);
        }
        return newSelectedIds;
    });
  }, [onSelectedCardsChange]);

  useEffect(() => {
    const updated = prepareDatasets(allDatasetsWithEnhancedLayers, {
      search,
      taxonomies,
      sortField,
      sortDir,
      filterLayers: filterLayers ?? false
    });
    setDatasetsToDisplay(updated);
  }, [allSelectedFilters, taxonomies, search, sortDir]);

  useEffect(() => {
    if (selectedIds !== prevSelectedIds) {
      let relevantIds: string[] | undefined = undefined;

      const selectedIdsWithParentData = selectedIds.map((selectedId) => {
        const parentData = findParentDataset(selectedId);
        const exclusiveSource = parentData?.sourceExclusive;
        const parentDataSourceValues = parentData?.taxonomy.filter((x) => x.name === 'Source')?.[0]?.values.map((value) => value.id);
        return {id: selectedId, values: parentDataSourceValues, sourceExclusive: exclusiveSource?.toLowerCase() || ''};
      });

      if (exclusionSelected) {
        relevantIds = selectedIdsWithParentData.filter((x) => x.values?.includes(x.sourceExclusive)).map((x) => x.id);
      } else {
        relevantIds = selectedIdsWithParentData.filter((x) => !x.values?.includes(x.sourceExclusive)).map((x) => x.id);
      }

      setSelectedIds((ids) =>
        ids.filter((id) => relevantIds?.includes(id))
      );
    }
  }, [exclusionSelected]);

  const getSelectedLayerCount = (dataset) => {
    return dataset.layers.filter((layer) => selectedIds.includes(layer.id)).length;
  };

  return (
    <Content>
      <FiltersControl
        {...controlVars}
        taxonomiesOptions={datasetTaxonomies}
        onChangeToFilters={handleChangeAllSelectedFilters}
        clearedTagItem={clearedTagItem}
        setClearedTagItem={setClearedTagItem}
        allSelected={allSelectedFilters}
      />
      <Catalog>
        <CatalogTagsContainer
          allSelectedFilters={allSelectedFilters}
          urlTaxonomyItems={urlTaxonomyItems}
          handleClearTag={handleClearTag}
          handleClearTags={handleClearTags}
        />
        {datasetsToDisplay.length ? (
          isSelectable ? (
            <Cards>
              {datasetsToDisplay.map((currentDataset) => (
                <div key={currentDataset.id}>
                  <Intro>
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
                          {exclusiveSourceWarning}
                        </WarningPill>
                      )}
                    </Headline>
                    <p>
                      <TextHighlight
                        value={search}
                        disabled={search.length < 3}
                      >
                        {currentDataset.description}
                      </TextHighlight>
                    </p>
                  </Intro>
                  <Cards>
                    {currentDataset.layers.map((datasetLayer) => (
                      <li key={datasetLayer.id}>
                        <CatalogCardSelectable
                          searchTerm={search}
                          layer={datasetLayer}
                          parent={currentDataset}
                          selected={selectedIds.includes(datasetLayer.id)}
                          onDatasetClick={() => onCheck(datasetLayer.id, currentDataset)}
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
                  <CatalogCard dataset={d} search={search} />
                </li>
              ))}
            </Cards>
          )
        ) : (
          <EmptyState>
            There are no datasets to show with the selected filters.
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

const ParentDatasetTitle = styled.h2<{size?: string}>`
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

const Intro = styled.div`
  padding: ${glsp(1)} 0;
`;

const Content = styled.div`
  display: flex;
  margin-bottom: 8rem;
  position: relative;
`;

const Catalog = styled.div`
  width: 100%;
`;

const Cards = styled(CardList)`
  padding: 0 0 0 2rem;
`;

const EmptyState = styled(EmptyHub)`
  margin-left: 2rem;
`;

const SelectedCard = styled.div`
  background-color: ${themeVal('color.primary')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: 0 ${glsp(0.5)};
  color: ${themeVal('color.surface')};
  margin-left: ${glsp(0.5)};
`;