import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';
import { resourceNotFound } from '$components/uhoh';
import { PageLead, PageMainContent } from '$styles/page';

import { useThematicArea } from '$utils/thematics';
import { thematicDiscoveriesPath } from '$utils/routes';

function DiscoveriesHub() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title='Discoveries' />
      <PageHero
        title='Discoveries'
        heroBlockBetaContent={
          <PageLead>
            Explore the guided narratives below to discover how NASA satellites
            and other Earth observing resources reveal a changing planet.
          </PageLead>
        }
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Browse</FoldTitle>
        </FoldHeader>
        <CardList>
          {thematic.data.discoveries.map((t) => (
            <li key={t.id}>
              <Card
                linkLabel='View more'
                linkTo={t.id}
                title={t.name}
                parentName='Discovery'
                parentTo={thematicDiscoveriesPath(thematic)}
                description={t.description}
                date={t.pubDate ? new Date(t.pubDate) : null}
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

export default DiscoveriesHub;
