import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';

import PageHeroAnalysis from '$components/analysis/page-hero-analysis';

import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';

import { useThematicArea } from '$utils/thematics';

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Covering 8 datasets over a 50 M km2 area from Apr 7 to Sep 7, 2022.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHeroAnalysis
        title='Analysis'
        description='Covering 8 datasets over a 50 M km2 area from Apr 7 to Sep 7, 2022.'
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Results</FoldTitle>
        </FoldHeader>
        <div>
          <p>Content goes here.</p>
        </div>
      </Fold>
    </PageMainContent>
  );
}
