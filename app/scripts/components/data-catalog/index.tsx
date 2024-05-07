import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { DatasetData } from 'veda';
import { useNavigate } from 'react-router-dom';
import { themeVal } from '@devseed-ui/theme-provider';
import FiltersControl from './filters-control';
import FilterTag from './filter-tag';
import prepareDatasets from './prepare-datasets';
import {
  Actions,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import {
  useSlidingStickyHeaderProps
} from '$components/common/layout-root';

import {
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import { Card } from '$components/common/card';
import { CardList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import {
  getAllTaxonomyValues,
  getTaxonomyByIds,
  generateTaxonomies,
} from '$utils/veda-data';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import { OptionItem } from '$components/common/form/checkable-filter';
import { usePreviousValue } from '$utils/use-effect-previous';
import { getAllDatasetsWithEnhancedLayers } from '$components/exploration/data-utils';

/**
 * DATA CATALOG Feature component 
 * Allows you to browse through datasets using the filters sidebar control
 */

const DataCatalogWrapper = styled.div`
  width: 100%;
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
  margin-top: ${variableGlsp(2)};
  padding-left: ${variableGlsp()};
  padding-right: ${variableGlsp()};
  gap: ${variableGlsp()};
`;

const CatalogFoldHeader = styled(FoldHeader)`
  margin-bottom: 4rem;
`;

const Content = styled.div`
  display: flex;
  margin-bottom: 8rem;
  position: relative;
`;

const CatalogWrapper = styled.div`
  width: 100%;
`;

const Cards = styled(CardList)`
  padding: 0 0 0 2rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 0 2.4rem 2rem;
`;

const PlainTextButton = styled.button`
  background: none;
  border: none;
  outline: none;
  box-shadow: none;
  color: ${themeVal('color.primary-400')};
  text-decoration: underline;
  font-size: ${variableBaseType('0.6rem')};
  &:hover {
    color: ${themeVal('color.primary-800')};
  }
`;

const EmptyState = styled(EmptyHub)`
  margin-left: 2rem;
`;

export const sortOptions = [{ id: 'name', name: 'Name' }];

export interface DataCatalogProps {
  datasets: DatasetData[];
}

function DataCatalog({ 
  datasets,
}: DataCatalogProps) {
  const controlVars = useBrowserControls({
    sortOptions
  });

  const navigate = useNavigate();

  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const datasetTaxonomies = generateTaxonomies(datasets);

  const urlTaxonomyItems = taxonomies? Object.entries(taxonomies).map(([key, val]) => getTaxonomyByIds(key, val, datasetTaxonomies)).flat(): [];
  
  const allDatasetsWithEnhancedLayers = useMemo(() => getAllDatasetsWithEnhancedLayers(datasets), [datasets]);

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

  const prevSelectedFilters = usePreviousValue(allSelectedFilters) || [];

  // Handlers
  const handleChangeAllSelectedFilters = useCallback((item: OptionItem, action: 'add' | 'remove') => {
    if(action == 'add') {
      setAllSelectedFilters([...allSelectedFilters, item]);
    } 
    
    if (action == 'remove') {
      setAllSelectedFilters(allSelectedFilters.filter((selected) => selected.id !== item.id));
    }
    onAction(Actions.TAXONOMY_MULTISELECT, { key: item.taxonomy, value: item.id });
  }, [setAllSelectedFilters, allSelectedFilters, onAction]);

  const handleClearTag = useCallback((item: OptionItem) => {
    setAllSelectedFilters(allSelectedFilters.filter((selected) => selected !== item));
    setClearedTagItem(item);

  }, [allSelectedFilters]);

  const handleClearTags = useCallback(() => {
    setAllSelectedFilters([]);
  }, [setAllSelectedFilters]);

  useEffect(() => {
    if (clearedTagItem && (allSelectedFilters.length == prevSelectedFilters.length-1)) {
      onAction(Actions.TAXONOMY_MULTISELECT, { key: clearedTagItem.taxonomy, value: clearedTagItem.id}); 
      setClearedTagItem(undefined);
    }
  }, [allSelectedFilters, clearedTagItem]);

  useEffect(() => {
    if(!allSelectedFilters.length) {
      onAction(Actions.CLEAR);
      navigate(DATASETS_PATH);
    }
  }, [allSelectedFilters]);

  useEffect(() => {
    const updated = prepareDatasets(allDatasetsWithEnhancedLayers, {
      search,
      taxonomies,
      sortField,
      sortDir,
      filterLayers: false
    });
    setDatasetsToDisplay(updated);
  }, [allSelectedFilters, taxonomies, search]);

  const { headerHeight } = useSlidingStickyHeaderProps();

  const renderTags = useMemo(() => {
    if (allSelectedFilters.length > 0 || urlTaxonomyItems.length > 0) {
      return (
        <Tags>
          {
            (allSelectedFilters.length > 0) ? (
              allSelectedFilters.map((filter) => <FilterTag key={`${filter.taxonomy}-${filter.id}`} item={filter} onClick={handleClearTag} />)
            ) : (
              urlTaxonomyItems.map((filter) => <FilterTag key={`${filter.taxonomy}-${filter.id}`} item={filter} onClick={handleClearTag} />)
            )
          }
          <PlainTextButton onClick={handleClearTags}>Clear all</PlainTextButton>
        </Tags>
      );
    }
    return null;
  }, [allSelectedFilters, handleClearTag, handleClearTags, urlTaxonomyItems]);

  return (
    <DataCatalogWrapper>
      <CatalogFoldHeader
        style={{
          scrollMarginTop: `${headerHeight + 16}px`
        }}
      >
        <FoldHeadline>
          <FoldTitle>Search datasets</FoldTitle>
        </FoldHeadline>
      </CatalogFoldHeader>
      <Content>
        <FiltersControl
          {...controlVars}
          taxonomiesOptions={datasetTaxonomies}
          onChangeToFilters={handleChangeAllSelectedFilters}
          clearedTagItem={clearedTagItem}
          setClearedTagItem={setClearedTagItem}
          allSelected={allSelectedFilters}
        />
        <CatalogWrapper>
          {renderTags}
          {datasetsToDisplay.length ? (
            <Cards>
              {
                datasetsToDisplay.map((d) => {
                  const allTaxonomyValues = getAllTaxonomyValues(d).map((v) => v.name);
                  return (
                    <li key={d.id}>
                      <Card
                        cardType='horizontal-info'
                        tagLabels={allTaxonomyValues}
                        linkTo={getDatasetPath(d)}
                        title={
                          <TextHighlight
                            value={search}
                            disabled={search.length < 3}
                          >
                            {d.name}
                          </TextHighlight>
                        }
                        description={
                          <TextHighlight
                            value={search}
                            disabled={search.length < 3}
                          >
                            {d.description}
                          </TextHighlight>
                        }
                        imgSrc={d.media?.src}
                        imgAlt={d.media?.alt}
                      />
                    </li>
                  );
                })
              }
            </Cards>
          ) : (
            <EmptyState>
              There are no datasets to show with the selected filters.
            </EmptyState>
          )}
        </CatalogWrapper>
      </Content>
    </DataCatalogWrapper>
  );
}

export default DataCatalog;