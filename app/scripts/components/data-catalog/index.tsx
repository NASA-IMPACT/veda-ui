import React, { useRef } from 'react';
import styled from 'styled-components';
import { DatasetData, datasetTaxonomies, getString } from 'veda';
import { Link, useNavigate } from 'react-router-dom';
import { themeVal } from '@devseed-ui/theme-provider';
import { VerticalDivider } from '@devseed-ui/toolbar';

import DatasetMenu from './dataset-menu';
import FiltersControl from './filters-control';
import FilterTag from './filter-tag';
import {
  Actions,
  optionAll,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import {
  LayoutProps,
  useSlidingStickyHeaderProps
} from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import {
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import { Card } from '$components/common/card';
import { CardList, CardMeta, CardTopicsList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import { Pill } from '$styles/pill';
import { FeaturedDatasets } from '$components/common/featured-slider-section';
import { CardSourcesList } from '$components/common/card-sources';
import { DatasetDataWithEnhancedLayers } from '$components/exploration/data-utils';
import {
  getAllTaxonomyValues,
  getTaxonomy,
  getTaxonomyByIds,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data';
import { DatasetClassification } from '$components/common/dataset-classification';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import { OptionItem } from '$components/common/form/checkable-filter';
import { usePreviousValue } from '$utils/use-effect-previous';

const BrowseFoldHeader = styled(FoldHeader)`
  margin-bottom: 4rem;
`;

const Content = styled.div`
  display: flex;
  margin-bottom: 8rem;
`;

const CatalogWrapper = styled.div`
  width: 100%;
`;

const BrowseSection = styled.div`
  width: 100%;
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
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

export const prepareDatasets = (
  data: DatasetData[],
  options: {
    search: string;
    taxonomies: Record<string, string | string[]> | null;
    sortField: string | null;
    sortDir: string | null;
    filterLayers: boolean | null;
  }
) => {
  const { sortField, sortDir, search, taxonomies, filterLayers } = options;
  let filtered = [...data];

  // Does the free text search appear in specific fields?
  if (search.length >= 3) {
    const searchLower = search.toLowerCase();
    // Function to check if searchLower is included in any of the string fields
    const includesSearchLower = (str) => str.toLowerCase().includes(searchLower);
    // Function to determine if a layer matches the search criteria
    const layerMatchesSearch = (layer) => 
      includesSearchLower(layer.stacCol) ||
      includesSearchLower(layer.name) ||
      includesSearchLower(layer.parentDataset.name) ||
      includesSearchLower(layer.parentDataset.id) ||
      includesSearchLower(layer.description);

    filtered = filtered
      .filter((d) => {
        // Pre-calculate lowercased versions to use in comparisons
        const idLower = d.id.toLowerCase();
        const nameLower = d.name.toLowerCase();
        const descriptionLower = d.description.toLowerCase();
        const topicsTaxonomy = d.taxonomy.find((t) => t.name === TAXONOMY_TOPICS);
        // Check if any of the conditions for including the item are met
        return (
          idLower.includes(searchLower) ||
          nameLower.includes(searchLower) ||
          descriptionLower.includes(searchLower) ||
          d.layers.some(layerMatchesSearch) ||
          topicsTaxonomy?.values.some((t) => includesSearchLower(t.name))
        );
      });

      if (filterLayers)
        filtered = filtered.map((d) => ({
          ...d,
          layers: d.layers.filter(layerMatchesSearch),
        }));
  }

  taxonomies &&
    Object.entries(taxonomies).forEach(([name, value]) => {
      if (!value.includes(optionAll.id)) {
        filtered = filtered.filter((d) =>
          d.taxonomy.some(
            (t) => t.name === name && t.values.some((v) => value.includes(v.id))
          )
        );
      }
    });

  sortField &&
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.sort((a, b) => {
      if (!a[sortField]) return Infinity;

      return a[sortField]?.localeCompare(b[sortField]);
    });

  if (sortDir === 'desc') {
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.reverse();
  }

  return filtered;
};

export interface DataCatalogProps {
  datasets: DatasetDataWithEnhancedLayers[]
}

function DataCatalog({ datasets }: DataCatalogProps) {
  const controlVars = useBrowserControls({
    sortOptions
  });

  const navigate = useNavigate();

  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';
  let urlTaxonomyItems: OptionItem[] = [];

  if (taxonomies) {
    urlTaxonomyItems = Object.entries(taxonomies).map(([key, val]) => getTaxonomyByIds(key, val, datasetTaxonomies)).flat() || [];
  }

  const [datasetsToDisplay, setDatasetsToDisplay] = React.useState<DatasetData[]>(
    prepareDatasets(datasets, {
    search,
    taxonomies,
    sortField,
    sortDir,
    filterLayers: false
  }));

  const [allSelectedFilters, setAllSelectedFilters] = React.useState<OptionItem[]>(urlTaxonomyItems);
  const [clearedTagItem, setClearedTagItem] = React.useState<OptionItem>();

  const prevSelectedFilters = usePreviousValue(allSelectedFilters) || [];

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
    const updated = prepareDatasets(datasets, {
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
    <PageMainContent>
      <LayoutProps
        title='Data Catalog'
        description={getString('dataCatalogBanner').other}
      />
      <PageHero
        title='Data Catalog'
        description={getString('dataCatalogBanner').other}
      />

      <FeaturedDatasets />
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
          />
          <CatalogWrapper>
            {renderTags}
            {datasetsToDisplay.length ? (
              <Cards>
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
    </PageMainContent>
  );
}

export default DataCatalog;