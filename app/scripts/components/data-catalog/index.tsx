import React from 'react';
import styled from 'styled-components';
import { datasets } from 'veda';
import { Subtitle } from '@devseed-ui/typography';

import BrowseControls from './browse-controls';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';

/* eslint-disable-next-line fp/no-mutating-methods */
const allDatasets = Object.values(datasets)
  .filter((d) => !!d?.data)
  .map((d) => d!.data)
  .sort((a, b) => a.name.localeCompare(b.name));

const DatasetCount = styled(Subtitle)`
  grid-column: 1 / -1;
  text-transform: uppercase;
`;

function DataCatalog() {
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
      <Fold>
        <FoldHeader>
          <FoldTitle>Browse</FoldTitle>
        </FoldHeader>

        <BrowseControls />

        <DatasetCount>Showing XX datasets</DatasetCount>

        {allDatasets.length ? (
          <CardList>
            {allDatasets.map((t) => (
              <li key={t.id}>
                <Card
                  cardType='cover'
                  linkLabel='View more'
                  linkTo={getDatasetPath(t)}
                  title={t.name}
                  parentName='Dataset'
                  parentTo={DATASETS_PATH}
                  description={t.description}
                  imgSrc={t.media?.src}
                  imgAlt={t.media?.alt}
                />
              </li>
            ))}
          </CardList>
        ) : (
          <EmptyHub>There are no datasets to show. Check back later.</EmptyHub>
        )}
      </Fold>
    </PageMainContent>
  );
}

export default DataCatalog;
