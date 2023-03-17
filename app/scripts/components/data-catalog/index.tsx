import React from 'react';
import { datasets } from 'veda/thematics';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';
import EmptyHub from '$components/common/empty-hub';

import { PageMainContent } from '$styles/page';
import { thematicDatasetsPath } from '$utils/routes';

/* eslint-disable-next-line fp/no-mutating-methods */
const allDatasets = Object.values(datasets)
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
  .filter((d) => !!d?.data && !!d.data.thematics?.length)
  .map((d) => d!.data)
  .sort((a, b) => (a.name.localeCompare(b.name));

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
        {allDatasets.length ? (
          <CardList>
            {allDatasets.map((t) => (
              <li key={t.id}>
                <Card
                  cardType='cover'
                  linkLabel='View more'
                  linkTo={`${thematicDatasetsPath(t.thematics[0])}/${t.id}`}
                  title={t.name}
                  parentName='Dataset'
                  parentTo={thematicDatasetsPath(t.thematics[0])}
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
