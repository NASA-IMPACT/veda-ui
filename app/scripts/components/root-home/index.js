import React from 'react';

import deltaThematics from 'delta/thematics';
import { PageMainContent } from '../../styles/page';

import { LayoutProps } from '../common/layout-root';
import PageHero from '../common/page-hero';
import { Card, CardList } from '$components/common/card';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';

const appTitle = process.env.APP_TITLE;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHero title={`Welcome to the ${appTitle}`} />
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
                overline={`has ${t.datasets.length} datasets & ${t.discoveries.length} discoveries`}
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
