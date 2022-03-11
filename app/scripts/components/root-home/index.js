import React from 'react';
import styled from 'styled-components';

import deltaThematics from 'delta/thematics';
import { PageMainContent } from '../../styles/page';

import { LayoutProps } from '../common/layout-root';
import PageHero from '../common/page-hero';
import { Card, CardList } from '$components/common/card';
import { Fold } from '$components/common/fold';
import { visuallyHidden } from '@devseed-ui/theme-provider';

const WelcomeFold = styled(Fold)`
  h2:first-of-type {
    ${visuallyHidden}
  }
`;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHero title='Welcome' />
      <WelcomeFold>
        <h2>Explore the areas</h2>
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
      </WelcomeFold>
    </PageMainContent>
  );
}

export default RootHome;
