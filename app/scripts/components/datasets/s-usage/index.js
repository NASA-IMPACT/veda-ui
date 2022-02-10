import React from 'react';

import { LayoutProps } from '../../common/layout-root';
import { resourceNotFound } from '../../uhoh';
import { PageMainContent } from '../../../styles/page';
import PageLocalNav from '../../common/page-local-nav';

import {
  useThematicArea,
  useThematicAreaDataset
} from '../../../utils/thematics';
import { FoldProse } from '../../common/fold';
import PageHero from '../../common/page-hero';

function DatasetsUsage() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <>
      <LayoutProps title={`${dataset.data.name} usage`} />
      <PageLocalNav
        title={dataset.data.name}
        thematic={thematic}
        dataset={dataset}
      />
      <PageMainContent>
        <PageHero title='Usage' description={dataset.data.description} />
        <FoldProse>
          <p>And how exactly does this dataset get used?</p>
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DatasetsUsage;
