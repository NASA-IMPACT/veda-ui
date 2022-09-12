import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';

import { useThematicArea } from '$utils/thematics';

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis Results'
        description='Visualize insights from a selected area over a period of time.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHero
        title='Analysis Results'
        description='Visualize insights from a selected area over a period of time.'
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Analysis Results</FoldTitle>
        </FoldHeader>
        <div>
          <p>Content goes here.</p>
        </div>
      </Fold>
    </PageMainContent>
  );
}
