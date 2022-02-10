import React from 'react';
import { Link } from 'react-router-dom';

import { LayoutProps } from '../../common/layout-root';
import PageHero from '../../common/page-hero';
import Fold from '../../common/fold';

import { PageMainContent } from '../../../styles/page';
import { Card, CardList } from '../../../styles/card';
import { resourceNotFound } from '../../uhoh';

import { useThematicArea } from '../../../utils/thematics';

function DiscoveriesHub() {
  const thematic = useThematicArea();
  if (!thematic) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title='Discoveries' />
      <PageHero
        title='Discoveries'
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />
      <Fold>
        <CardList>
          {thematic.data.discoveries.map((t) => (
            <li key={t.id}>
              <Card>
                <Link to={`${t.id}`}>
                  <h2>{t.name}</h2>
                </Link>
              </Card>
            </li>
          ))}
        </CardList>
      </Fold>
    </PageMainContent>
  );
}

export default DiscoveriesHub;
