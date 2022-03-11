import React from 'react';
import { Link } from 'react-router-dom';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold } from '$components/common/fold';
import { ElementInteractive } from '$components/common/element-interactive';

import { PageMainContent } from '../../../styles/page';
import { Card, CardHeader, CardList, CardTitle } from '../../../styles/card';
import { resourceNotFound } from '../../uhoh';

import { useThematicArea } from '../../../utils/thematics';

function DiscoveriesHub() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title='Discoveries' />
      <PageHero
        title='Discoveries'
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />
      <Fold>
        <h2>Browse</h2>
        <CardList>
          {thematic.data.discoveries.map((t) => (
            <li key={t.id}>
              <ElementInteractive
                as={Card}
                linkLabel='View more'
                linkProps={{
                  as: Link,
                  to: t.id
                }}
              >
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                </CardHeader>
              </ElementInteractive>
            </li>
          ))}
        </CardList>
      </Fold>
    </PageMainContent>
  );
}

export default DiscoveriesHub;
