import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';
import { resourceNotFound } from '$components/uhoh';
import EmptyHub from '$components/common/empty-hub';

import { PageMainContent } from '$styles/page';
import { useThematicArea } from '$utils/veda-data';
import { DATASETS_PATH } from '$utils/routes';

function DatasetsHub() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title='Datasets' />
      <PageHero
        title='Datasets'
        description='This dashboard explores key indicators to track and compare changes over time.'
        thumbnail={thematic.data.media?.src}
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Browse</FoldTitle>
        </FoldHeader>
        {thematic.data.datasets.length ? (
          <CardList>
            {thematic.data.datasets.map((t) => (
              <li key={t.id}>
                <Card
                  cardType='cover'
                  linkLabel='View more'
                  linkTo={t.id}
                  title={t.name}
                  parentName='Dataset'
                  parentTo={DATASETS_PATH}
                  description={t.description}
                  imgSrc={t.media.src}
                  imgAlt={t.media.alt}
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

export default DatasetsHub;
