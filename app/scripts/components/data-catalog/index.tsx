import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { DatasetData, datasetTaxonomies, getString } from 'veda';
import { Link } from 'react-router-dom';
import { glsp } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import DatasetMenu from './dataset-menu';

import BrowseControls from '$components/common/browse-controls';
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
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import { Card } from '$components/common/card';
import { CardListGrid, CardMeta, CardTopicsList } from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import Pluralize from '$utils/pluralize';
import { Pill } from '$styles/pill';
import { FeaturedDatasets } from '$components/common/featured-slider-section';
import { CardSourcesList } from '$components/common/card-sources';
import {
  getTaxonomy,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data';
import { DatasetClassification } from '$components/common/dataset-classification';
import { DatasetDataWithEnhancedLayers } from '$components/exploration/data-utils';

const DatasetCount = styled(Subtitle)`
  grid-column: 1 / -1;
  display: flex;
  gap: ${glsp(0.5)};

  span {
    text-transform: uppercase;
    line-height: 1.5rem;
  }
`;

const BrowseFoldHeader = styled(FoldHeader)`
  flex-flow: column nowrap;
  align-items: flex-start;
`;

export const sortOptions = [{ id: 'name', name: 'Name' }];

export const prepareDatasets = (
  data: DatasetData[],
  options: {
    search: string;
    taxonomies: Record<string, string> | null;
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
      if (value !== optionAll.id) {
        filtered = filtered.filter((d) =>
          d.taxonomy.some(
            (t) => t.name === name && t.values.some((v) => v.id === value)
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

  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const displayDatasets = useMemo(
    () =>
      prepareDatasets(datasets, {
        search,
        taxonomies,
        sortField,
        sortDir,
        filterLayers: false
      }),
    [search, taxonomies, sortField, sortDir]
  );

  const isFiltering = !!(
    (taxonomies && Object.keys(taxonomies).length) ||
    search
  );

  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();

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

      <Fold>
        <BrowseFoldHeader
          ref={browseControlsHeaderRef}
          style={{
            scrollMarginTop: `${headerHeight + 16}px`
          }}
        >
          <FoldHeadline>
            <FoldTitle>Browse</FoldTitle>
          </FoldHeadline>
          <BrowseControls
            {...controlVars}
            taxonomiesOptions={datasetTaxonomies}
          />
        </BrowseFoldHeader>

        <DatasetCount>
          <span>
            Showing{' '}
            <Pluralize
              singular='dataset'
              plural='datasets'
              count={displayDatasets.length}
              showCount={true}
            />{' '}
            out of {displayDatasets.length}.
          </span>
          {isFiltering && (
            <Button forwardedAs={Link} to={DATASETS_PATH} size='small'>
              Clear filters <CollecticonXmarkSmall />
            </Button>
          )}
        </DatasetCount>

        {displayDatasets.length ? (
          <CardListGrid>
            {displayDatasets.map((d) => {
              const topics = getTaxonomy(d, TAXONOMY_TOPICS)?.values;
              return (
                <li key={d.id}>
                  <Card
                    cardType='cover'
                    overline={
                      <CardMeta>
                        <DatasetClassification dataset={d} />
                        <CardSourcesList
                          sources={getTaxonomy(d, TAXONOMY_SOURCE)?.values}
                          rootPath={DATASETS_PATH}
                          onSourceClick={(id) => {
                            onAction(Actions.TAXONOMY, {
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
                            {topics.map((t) => (
                              <dd key={t.id}>
                                <Pill
                                  variation='achromic'
                                  as={Link}
                                  to={`${DATASETS_PATH}?${
                                    Actions.TAXONOMY
                                  }=${encodeURIComponent(
                                    JSON.stringify({ Topics: t.id })
                                  )}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onAction(Actions.TAXONOMY, {
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
                            ))}
                          </CardTopicsList>
                        ) : null}
                        <DatasetMenu dataset={d} />
                      </>
                    }
                  />
                </li>
              );
            })}
          </CardListGrid>
        ) : (
          <EmptyHub>
            There are no datasets to show with the selected filters.
          </EmptyHub>
        )}
      </Fold>
    </PageMainContent>
  );
}

export default DataCatalog;