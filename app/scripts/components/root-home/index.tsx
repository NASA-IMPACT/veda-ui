import React from 'react';

import vedaThematics from 'veda/thematics';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Card, CardList } from '$components/common/card';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import Pluralize from '$utils/pluralize';

const appTitle = process.env.APP_TITLE;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHero
        title={`Welcome to ${appTitle}: NASA’s open-source Earth Science platform in the cloud.`}
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Explore the thematic areas</FoldTitle>
        </FoldHeader>
        <CardList>
          {vedaThematics.map((t) => (
            <li key={t.id}>
              <Card
                cardType='cover'
                linkLabel='View more'
                linkTo={t.id}
                title={t.name}
                parentName='Area'
                parentTo='/'
                description={t.description}
                overline={
                  <>
                    <i>Contains </i>
                    <Pluralize
                      zero='no discoveries'
                      singular='discovery'
                      plural='discoveries'
                      count={t.discoveries.length}
                    />
                    {' / '}
                    <Pluralize
                      zero='no datasets'
                      singular='dataset'
                      count={t.datasets.length}
                    />
                  </>
                }
                imgSrc={t.media?.src}
                imgAlt={t.media?.alt}
              />
            </li>
          ))}
        </CardList>
      </Fold>
    </PageMainContent>
  );
}

export default RootHome;
