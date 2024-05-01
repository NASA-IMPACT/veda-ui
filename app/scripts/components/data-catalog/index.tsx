import React, { useRef } from 'react';
import styled from 'styled-components';
import { DatasetData } from 'veda';
import { Link, useNavigate } from 'react-router-dom';
import { themeVal } from '@devseed-ui/theme-provider';
import { VerticalDivider } from '@devseed-ui/toolbar';

import DatasetMenu from './dataset-menu';
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
import { CardList, CardMeta, CardTopicsList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import { Pill } from '$styles/pill';
import { CardSourcesList } from '$components/common/card-sources';
import {
  getAllTaxonomyValues,
  getTaxonomy,
  getTaxonomyByIds,
  generateTaxonomies,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data';
import { DatasetClassification } from '$components/common/dataset-classification';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import { OptionItem } from '$components/common/form/checkable-filter';
import { usePreviousValue } from '$utils/use-effect-previous';
import { getAllDatasetsWithEnhancedLayers } from '$components/exploration/data-utils';

/**
 * DATA CATALOG Feature component 
 * Allows you to browse through datasets using the filters sidebar control
 */

const BrowseFoldHeader = styled(FoldHeader)`
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

const BrowseSection = styled.div`
  width: 100%;
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
  margin-top: ${variableGlsp(2)};
  padding-left: ${variableGlsp()};
  padding-right: ${variableGlsp()};
  gap: ${variableGlsp()};
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

function DataCatalog({ datasets }: DataCatalogProps) {
  const controlVars = useBrowserControls({
    sortOptions
  });

  const navigate = useNavigate();

  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';
  let urlTaxonomyItems: OptionItem[] = [];

  const datasetTaxonomies = generateTaxonomies(datasets);

  if (taxonomies) {
    urlTaxonomyItems = Object.entries(taxonomies).map(([key, val]) => getTaxonomyByIds(key, val, datasetTaxonomies)).flat() || [];
  }

  const allDatasetsWithEnhancedLayers = React.useMemo(() => getAllDatasetsWithEnhancedLayers(datasets), [datasets]);

  const [datasetsToDisplay, setDatasetsToDisplay] = React.useState<DatasetData[]>(
    prepareDatasets(allDatasetsWithEnhancedLayers, {
    search,
    taxonomies,
    sortField,
    sortDir,
    filterLayers: false
  }));

  const [allSelectedFilters, setAllSelectedFilters] = React.useState<OptionItem[]>(urlTaxonomyItems);
  const [clearedTagItem, setClearedTagItem] = React.useState<OptionItem>();

  const prevSelectedFilters = usePreviousValue(allSelectedFilters) || [];

  const targetRef = React.useRef<HTMLOListElement>(null);
  const [targetHeight, setTargetHeight] = React.useState<number>(0);

  // Handlers
  const handleChangeAllSelectedFilters = React.useCallback((item: OptionItem, action: 'add' | 'remove') => {
    if(action == 'add') {
      setAllSelectedFilters([...allSelectedFilters, item]);
    } 
    
    if (action == 'remove') {
      setAllSelectedFilters(allSelectedFilters.filter((selected) => selected.id !== item.id));
    }
    onAction(Actions.TAXONOMY_MULTISELECT, { key: item.taxonomy, value: item.id });
  }, [setAllSelectedFilters, allSelectedFilters, onAction]);

  const handleClearTag = React.useCallback((item: OptionItem) => {
    setAllSelectedFilters(allSelectedFilters.filter((selected) => selected !== item));
    setClearedTagItem(item);

  }, [allSelectedFilters]);

  const handleClearTags = React.useCallback(() => {
    setAllSelectedFilters([]);
  }, [setAllSelectedFilters]);

  React.useEffect(() => {
    if(targetRef.current) {
      const height = targetRef.current.offsetHeight;
      setTargetHeight(height);
    }
  }, [targetRef]);

  React.useEffect(() => {
    if (clearedTagItem && (allSelectedFilters.length == prevSelectedFilters.length-1)) {
      onAction(Actions.TAXONOMY_MULTISELECT, { key: clearedTagItem.taxonomy, value: clearedTagItem.id}); 
      setClearedTagItem(undefined);
    }
  }, [allSelectedFilters, clearedTagItem]);

  React.useEffect(() => {
    if(!allSelectedFilters.length) {
      onAction(Actions.CLEAR);
      navigate(DATASETS_PATH);
    }
  }, [allSelectedFilters]);

  React.useEffect(() => {
    const updated = prepareDatasets(allDatasetsWithEnhancedLayers, {
      search,
      taxonomies,
      sortField,
      sortDir,
      filterLayers: false
    });
    setDatasetsToDisplay(updated);
  }, [allSelectedFilters, taxonomies, search]);

  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();

  const renderTags = React.useMemo(() => {
    if(allSelectedFilters.length > 0 || urlTaxonomyItems.length > 0) {
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
    <BrowseSection>
      <BrowseFoldHeader
        ref={browseControlsHeaderRef}
        style={{
          scrollMarginTop: `${headerHeight + 16}px`
        }}
      >
        <FoldHeadline>
          <FoldTitle>Search datasets</FoldTitle>
        </FoldHeadline>
      </BrowseFoldHeader>
      <Content>
        <FiltersControl
          {...controlVars}
          taxonomiesOptions={datasetTaxonomies}
          onChangeToFilters={handleChangeAllSelectedFilters}
          clearedTagItem={clearedTagItem}
          setClearedTagItem={setClearedTagItem}
          allSelected={allSelectedFilters}
          areaHeight={targetHeight}
        />
        <CatalogWrapper>
          {renderTags}
          {datasetsToDisplay.length ? (
            <Cards ref={targetRef}>
              {datasetsToDisplay.map((d) => {
                const topics = getTaxonomy(d, TAXONOMY_TOPICS)?.values;
                const allTaxonomyValues = getAllTaxonomyValues(d).map((v) => v.name);
                return (
                  <li key={d.id}>
                    <Card
                      cardType='horizontal-info'
                      tagLabels={allTaxonomyValues}
                      overline={
                        <CardMeta>
                          <DatasetClassification dataset={d} />
                          <CardSourcesList
                            sources={getTaxonomy(d, TAXONOMY_SOURCE)?.values}
                            rootPath={DATASETS_PATH}
                            onSourceClick={(id) => {
                              onAction(Actions.TAXONOMY_MULTISELECT, {
                                key: TAXONOMY_SOURCE,
                                value: id
                              });
                              browseControlsHeaderRef.current?.scrollIntoView();
                            }}
                          />
                          <VerticalDivider variation='light' />
                          {/* TODO: Implement modified date: https://github.com/NASA-IMPACT/veda-ui/issues/514 */}
                          {/* 
                        <Link
                          to={`${DATASETS_PATH}?${Actions.SORT_FIELD}=date`}
                          onClick={(e) => {
                            e.preventDefault();
                            onAction(Actions.SORT_FIELD, 'date');
                          }}
                        >
                          Updated <time dateTime='2023-01-01'>X time ago</time>
                        </Link> */}
                        </CardMeta>
                      }
                      linkLabel='View more'
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
                      footerContent={
                        <>
                          {topics?.length ? (
                            <CardTopicsList>
                              <dt>Topics</dt>
                              {topics.map((t) => {
                                const path = `${DATASETS_PATH}?${
                                  Actions.TAXONOMY
                                }=${encodeURIComponent(
                                  JSON.stringify({ Topics: [t.id] })
                                )}`;
                                return (
                                  <dd key={t.id}>
                                    <Pill
                                      variation='achromic'
                                      as={Link}
                                      to={path}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        onAction(Actions.TAXONOMY_MULTISELECT, {
                                          key: TAXONOMY_TOPICS,
                                          value: t.id
                                        });
                                        browseControlsHeaderRef.current?.scrollIntoView();
                                      }}
                                    >
                                      <TextHighlight
                                        value={search}
                                        disabled={search.length < 3}
                                      >
                                        {t.name}
                                      </TextHighlight>
                                    </Pill>
                                  </dd>
                                );
                              })}
                            </CardTopicsList>
                          ) : null}
                          <DatasetMenu dataset={d} />
                        </>
                      }
                    />
                  </li>
                );
              })}
            </Cards>
          ) : (
            <EmptyState>
              There are no datasets to show with the selected filters.
            </EmptyState>
          )}
        </CatalogWrapper>
      </Content>
    </BrowseSection>
  );
}

export default DataCatalog;