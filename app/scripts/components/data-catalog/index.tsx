import React from 'react';
import styled from 'styled-components';
import { DatasetData, datasets } from 'veda';
import { Link } from 'react-router-dom';
import { Subtitle } from '@devseed-ui/typography';

import BrowseControls from './browse-controls';
import { Actions, useBrowserControls } from './use-browse-controls';
import FeaturedDatasets from './featured-datasets';
import DatasetMenu from './dataset-menu';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import {
  Card,
  CardList,
  CardMeta,
  CardTopicsList
} from '$components/common/card';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import Pluralize from '$utils/pluralize';
import { Pill } from '$styles/pill';

const allDatasets = Object.values(datasets).map((d) => d!.data);

const DatasetCount = styled(Subtitle)`
  grid-column: 1 / -1;
  text-transform: uppercase;
`;

const topicsOptions = [
  {
    id: 'all',
    name: 'All'
  },
  // TODO: human readable values for Taxonomies
  ...Array.from(new Set(allDatasets.flatMap((d) => d.thematics))).map((t) => ({
    id: t,
    name: t
  }))
];

const sourcesOptions = [
  {
    id: 'all',
    name: 'All'
  }
];

const prepareDatasets = (data: DatasetData[], options) => {
  const { sortField, sortDir, search, topic, source } = options;

  let filtered = [...data];

  // Does the free text search appear in specific fields?
  if (search.length >= 3) {
    filtered = filtered.filter(
      (d) =>
        d.name.includes(search) ||
        d.description.includes(search) ||
        d.layers.some((l) => l.stacCol.includes(search))
    );
  }

  if (topic !== 'all') {
    filtered = filtered.filter((d) => d.thematics.includes(topic));
  }

  if (source !== 'all') {
    // TODO: Filter source
  }

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

function DataCatalog() {
  const controlVars = useBrowserControls({
    topicsOptions,
    sourcesOptions
  });

  const { topic, source, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const displayDatasets = prepareDatasets(allDatasets, {
    search,
    topic,
    source,
    sortField,
    sortDir
  });

  return (
    <PageMainContent>
      <LayoutProps
        title='Data Catalog'
        description='This dashboard explores key indicators to track and compare changes over time.'
      />
      <PageHero
        title='Data Catalog'
        description='This dashboard explores key indicators to track and compare changes over time.'
      />

      <FeaturedDatasets />

      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Browse</FoldTitle>
          </FoldHeadline>
          <BrowseControls
            {...controlVars}
            topicsOptions={topicsOptions}
            sourcesOptions={sourcesOptions}
          />
        </FoldHeader>

        <DatasetCount>
          Showing{' '}
          <Pluralize
            singular='dataset'
            plural='datasets'
            count={displayDatasets.length}
            showCount={true}
          />
        </DatasetCount>

        {displayDatasets.length ? (
          <CardList>
            {displayDatasets.map((d) => (
              <li key={d.id}>
                <Card
                  cardType='cover'
                  overline={
                    <CardMeta>
                      <Link
                        to={`${DATASETS_PATH}?${Actions.SOURCE}=${'eis'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onAction(Actions.SOURCE, 'eis');
                        }}
                      >
                        By SOURCE
                      </Link>
                      {/* TODO: Implement modified date: https://github.com/NASA-IMPACT/veda-ui/issues/514 */}
                      {/* <VerticalDivider variation='light' />
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
                    <TextHighlight value={search} disabled={search.length < 3}>
                      {d.name}
                    </TextHighlight>
                  }
                  parentName='Dataset'
                  parentTo={DATASETS_PATH}
                  description={
                    <TextHighlight value={search} disabled={search.length < 3}>
                      {d.description}
                    </TextHighlight>
                  }
                  imgSrc={d.media?.src}
                  imgAlt={d.media?.alt}
                  footerContent={
                    <>
                      {d.thematics.length ? (
                        <CardTopicsList>
                          <dt>Topics</dt>
                          {d.thematics.map((t) => (
                            <dd key={t}>
                              <Pill
                                as={Link}
                                to={`${DATASETS_PATH}?${Actions.TOPIC}=${t}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onAction(Actions.TOPIC, t);
                                }}
                              >
                                {t}
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
            ))}
          </CardList>
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
