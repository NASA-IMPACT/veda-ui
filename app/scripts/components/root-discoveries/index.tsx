import React from 'react';
import { discoveries } from 'veda/thematics';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';
import EmptyHub from '$components/common/empty-hub';

import { PageMainContent } from '$styles/page';
import { thematicDiscoveriesPath } from '$utils/routes';

/* eslint-disable-next-line fp/no-mutating-methods */
const allDiscoveries = Object.values(discoveries)
  .map((d) => d!.data)
  .sort((a, b) => {
    const getTime = (d: string) => {
      const millis = new Date(d).getTime();
      return isNaN(millis) ? -Infinity : millis;
    };

    return getTime(b.pubDate) - getTime(a.pubDate);
  });

function Discoveries() {
  return (
    <PageMainContent>
      <LayoutProps
        title='Discoveries'
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />
      <PageHero
        title='Discoveries'
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Browse</FoldTitle>
        </FoldHeader>
        {allDiscoveries.length ? (
          <CardList>
            {allDiscoveries.map((t) => (
              <li key={t.id}>
                <Card
                  linkLabel='View more'
                  linkTo={`${thematicDiscoveriesPath(t.thematics[0])}/${t.id}`}
                  title={t.name}
                  parentName='Discovery'
                  parentTo={thematicDiscoveriesPath(t.thematics[0])}
                  description={t.description}
                  date={t.pubDate ? new Date(t.pubDate) : undefined}
                  imgSrc={t.media?.src}
                  imgAlt={t.media?.alt}
                />
              </li>
            ))}
          </CardList>
        ) : (
          <EmptyHub>
            There are no discoveries to show. Check back later.
          </EmptyHub>
        )}
      </Fold>
    </PageMainContent>
  );
}

export default Discoveries;
