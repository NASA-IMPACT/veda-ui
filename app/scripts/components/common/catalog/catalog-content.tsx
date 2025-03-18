import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import TextHighlight from '../text-highlight';
import { CollecticonDatasetLayers } from '../icons/dataset-layers';
import { USWDSCardGroup } from '../uswds';
import { Card, CardType } from '../card';
import { Tags } from '../tags';
import { prepareDatasets } from './prepare-datasets';
import FiltersControl from './filters-control';
import { CatalogCard } from './catalog-card';
import CatalogTagsContainer from './catalog-tags';

import {
  FilterActions,
  getDatasetDescription,
  getMediaProperty
} from './utils';
import { DatasetData } from '$types/veda';
import { CardList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import {
  getTaxonomyByIds,
  generateTaxonomies,
  getTaxonomy,
  TAXONOMY_SOURCE,
  getAllTaxonomyValues
} from '$utils/veda-data/taxonomies';
import { OptionItem } from '$components/common/form/checkable-filter';
import { Pill } from '$styles/pill';
import { usePreviousValue } from '$utils/use-effect-previous';
import Pagination from '$components/common/pagination';
import { useVedaUI } from '$context/veda-ui-provider';
import { findParentDatasetFromLayer } from '$utils/data-utils';
import { legacyGlobalStyleCSSBlock } from '$styles/legacy-global-styles';

const EXCLUSIVE_SOURCE_WARNING =
  'Can only be analyzed with layers from the same source';

export interface CatalogContentProps {
  datasets: DatasetData[];
  selectedIds?: string[];
  setSelectedIds?: (selectedIds: string[]) => void;
  filterLayers?: boolean;
  emptyStateContent?: React.ReactNode;
  search: string;
  taxonomies: Record<string, string[]>;
  onAction: (action: FilterActions, value?: any) => void;
  itemsPerPage?: number;
}

const DEFAULT_SORT_OPTION = 'asc';
const DEFAULT_SORT_FIELD = 'name';

function CatalogContent({
  datasets,
  selectedIds,
  setSelectedIds,
  filterLayers,
  emptyStateContent,
  search,
  taxonomies,
  onAction,
  itemsPerPage = 7
}: CatalogContentProps) {
  const [exclusiveSourceSelected, setExclusiveSourceSelected] = useState<
    string | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);

  const isSelectable = selectedIds !== undefined;
  const {
    routes: { dataCatalogPath }
  } = useVedaUI();
  const datasetTaxonomies = generateTaxonomies(datasets);
  const urlTaxonomyItems = taxonomies
    ? Object.entries(taxonomies)
        .map(([key, val]) => getTaxonomyByIds(key, val, datasetTaxonomies))
        .flat()
    : [];

  const [datasetsToDisplay, setDatasetsToDisplay] = useState<DatasetData[]>(
    prepareDatasets(datasets, {
      search,
      taxonomies,
      sortField: DEFAULT_SORT_FIELD,
      sortDir: DEFAULT_SORT_OPTION,
      filterLayers: filterLayers ?? false
    })
  );

  const [selectedFilters, setSelectedFilters] =
    useState<OptionItem[]>(urlTaxonomyItems);
  const [clearedTagItem, setClearedTagItem] = useState<OptionItem>();

  const prevSelectedFilters = usePreviousValue(selectedFilters) ?? [];

  // Handlers
  const updateSelectedFilters = useCallback(
    (item: OptionItem, action: 'add' | 'remove') => {
      if (action == 'add') {
        setSelectedFilters([...selectedFilters, item]);
      }

      if (action == 'remove') {
        setSelectedFilters(
          selectedFilters.filter((selected) => selected.id !== item.id)
        );
      }

      onAction(FilterActions.TAXONOMY_MULTISELECT, {
        key: item.taxonomy,
        value: item.id
      });
    },
    [setSelectedFilters, selectedFilters, onAction]
  );

  const handleClearTag = useCallback(
    (item: OptionItem) => {
      setSelectedFilters(
        selectedFilters.filter((selected) => selected !== item)
      );
      setClearedTagItem(item);
    },
    [selectedFilters]
  );

  const handleClearTags = useCallback(() => {
    setSelectedFilters([]);
    setExclusiveSourceSelected(null);
    onAction(FilterActions.CLEAR_TAXONOMY);
  }, [onAction]);

  useEffect(() => {
    if (
      clearedTagItem &&
      selectedFilters.length == prevSelectedFilters.length - 1
    ) {
      onAction(FilterActions.TAXONOMY_MULTISELECT, {
        key: clearedTagItem.taxonomy,
        value: clearedTagItem.id
      });
      setClearedTagItem(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, clearedTagItem]);

  useEffect(() => {
    if (!selectedFilters.length) {
      onAction(FilterActions.CLEAR_TAXONOMY);
    }

    setExclusiveSourceSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  const filterRelevantIdsBasedOnExclusion = (
    selectedIdsWithParentData,
    exclusionSelected
  ) => {
    if (exclusionSelected) {
      return selectedIdsWithParentData
        .filter((x) => x.values?.includes(x.sourceExclusive))
        .map((x) => x.id);
    } else {
      return selectedIdsWithParentData
        .filter((x) => !x.values?.includes(x.sourceExclusive))
        .map((x) => x.id);
    }
  };

  const onCardSelect = useCallback(
    (id: string, currentDataset: DatasetData) => {
      if (!setSelectedIds || selectedIds === undefined) return;

      const getSelectedIdsWithParentData = (selectedIds) => {
        return selectedIds.map((selectedId: string) => {
          const parentData = findParentDatasetFromLayer({
            layerId: selectedId,
            datasets
          });
          const exclusiveSource = parentData?.sourceExclusive;
          const parentDataSourceValues = parentData?.taxonomy
            .filter((x) => x.name === 'Source')[0]
            ?.values.map((value) => value.id);
          return {
            id: selectedId,
            values: parentDataSourceValues,
            sourceExclusive: exclusiveSource?.toLowerCase() ?? ''
          };
        });
      };

      const exclusiveSource = currentDataset.sourceExclusive?.toLowerCase();
      const sources = getTaxonomy(currentDataset, TAXONOMY_SOURCE)?.values;
      const sourceIds = sources?.map((source) => source.id);

      const newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];

      let selectedIdsWithParentData =
        getSelectedIdsWithParentData(newSelectedIds);

      // @NOTE: Check if the new exclusiveSource is selected. Filter out the old one.
      let prevExclusiveSourceValue;
      if (exclusiveSourceSelected)
        prevExclusiveSourceValue = exclusiveSourceSelected;
      else if (selectedIdsWithParentData.length)
        prevExclusiveSourceValue = selectedIdsWithParentData.find(
          (d) => d.sourceExclusive
        )?.sourceExclusive;
      if (exclusiveSource !== prevExclusiveSourceValue) {
        selectedIdsWithParentData = selectedIdsWithParentData.filter(
          (d) => d.sourceExclusive !== prevExclusiveSourceValue
        );
      }

      const relevantIdsBasedOnExclusion = filterRelevantIdsBasedOnExclusion(
        selectedIdsWithParentData,
        exclusiveSource && sourceIds?.includes(exclusiveSource)
      );

      if (exclusiveSource && sourceIds?.includes(exclusiveSource)) {
        setExclusiveSourceSelected(exclusiveSource);
      } else {
        setExclusiveSourceSelected(null);
      }

      setSelectedIds(
        newSelectedIds.filter((id) => relevantIdsBasedOnExclusion.includes(id))
      );
    },
    [selectedIds, setSelectedIds, exclusiveSourceSelected, datasets]
  );

  const generateCardsWithRoute = useMemo(
    () => (
      <USWDSCardGroup style={{ gap: '40px' }}>
        {datasetsToDisplay
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((d) => {
            const imgSrc = getMediaProperty(undefined, d, 'src');
            const imgAlt = getMediaProperty(undefined, d, 'alt');
            const description = getDatasetDescription(undefined, d);
            const allTaxonomyValues = getAllTaxonomyValues(d).map(
              (v) => v.name
            );

            return (
              <Card
                cardType={CardType.FLAG}
                key={d.id}
                imgSrc={imgSrc}
                imgAlt={imgAlt}
                title={d.name}
                description={description}
                footerContent={<Tags items={allTaxonomyValues} />}
                to={`${dataCatalogPath}/${d.id}`}
                cardLabel='data_collection'
              />
            );
          })}
      </USWDSCardGroup>
    ),
    [currentPage, itemsPerPage, datasetsToDisplay, dataCatalogPath]
  );

  useEffect(() => {
    const updated = prepareDatasets(datasets, {
      search,
      taxonomies,
      sortField: DEFAULT_SORT_FIELD,
      sortDir: DEFAULT_SORT_OPTION,
      filterLayers: filterLayers ?? false
    });
    setDatasetsToDisplay(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, taxonomies, search]);

  const getSelectedLayerCount = (dataset) => {
    return dataset.layers.filter((layer) => selectedIds?.includes(layer.id))
      .length;
  };

  const totalPages = Math.ceil(datasetsToDisplay.length / itemsPerPage);

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
        openByDefault={false}
      />
      <Catalog>
        <CatalogTagsContainer
          allSelectedFilters={selectedFilters}
          urlTaxonomyItems={urlTaxonomyItems}
          handleClearTag={handleClearTag}
          handleClearTags={handleClearTags}
        />
        {datasetsToDisplay.length ? (
          <>
            {isSelectable ? (
              <Cards>
                {datasetsToDisplay
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((currentDataset) => (
                    <div key={currentDataset.id}>
                      <div>
                        <Headline>
                          <ParentDatasetTitle>
                            <CollecticonDatasetLayers /> {currentDataset.name}
                            {getSelectedLayerCount(currentDataset) > 0 && (
                              <SelectedCard>
                                <span>
                                  {getSelectedLayerCount(currentDataset)}{' '}
                                  selected
                                </span>
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
                              onDatasetClick={() => {
                                onCardSelect(datasetLayer.id, currentDataset);
                              }}
                            />
                          </li>
                        ))}
                      </Cards>
                    </div>
                  ))}
              </Cards>
            ) : (
              generateCardsWithRoute
            )}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}
          </>
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

export const ParentDatasetTitle = styled.h2<{ size?: string }>`
  color: ${themeVal('color.primary')};
  text-align: left;
  font-size: ${(props) => (props.size == 'small' ? '0.75rem' : '1rem')};
  line-height: 0.75rem;
  font-weight: normal;
  ${(props) => (props.size == 'small' ? '400' : 'normal')};
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
    min-width: ${(props) => (props.size == 'small' ? '1rem' : 'auto')};
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
  * {
    ${legacyGlobalStyleCSSBlock}
  }
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
