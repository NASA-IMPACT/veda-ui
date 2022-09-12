import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';

import { useThematicArea } from '$utils/thematics';

export default function Analysis() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Visualize insights from a selected area over a period of time.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHero
        title='Analysis'
        description='Visualize insights from a selected area over a period of time.'
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Analysis</FoldTitle>
        </FoldHeader>
        <div>
          <p>Content goes here.</p>
        </div>
      </Fold>
    </PageMainContent>
  );
}
