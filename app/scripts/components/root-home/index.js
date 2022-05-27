import React from 'react';

import deltaThematics from 'delta/thematics';

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
      <PageHero title={`Welcome to ${appTitle}`} />
      <Fold>
        <FoldHeader>
          <FoldTitle>Browse the thematic areas</FoldTitle>
        </FoldHeader>
        <CardList>
          {deltaThematics.map((t) => (
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
                imgSrc={t.media.src}
                imgAlt={t.media.alt}
              />
            </li>
          ))}
        </CardList>
      </Fold>
    </PageMainContent>
  );
}

export default RootHome;
