import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import { FoldProse } from '$components/common/fold';
import PageHero from '$components/common/page-hero';

import { thematicDatasetsPath } from '$utils/routes';
import { useThematicArea, useThematicAreaDataset } from '$utils/thematics';

function DatasetsUsage() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!thematic || !dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps title={`${dataset.data.name} usage`} />
      <PageLocalNav
        parentName='Dataset'
        parentLabel='Datasets'
        parentTo={thematicDatasetsPath(thematic)}
        items={thematic.data.datasets}
        currentId={dataset.data.id}
        localMenuCmp={
          <DatasetsLocalMenu thematic={thematic} dataset={dataset} />
        }
      />
      <PageMainContent>
        <PageHero title={`${dataset.data.name} usage`} />
        <FoldProse>
          <p>And how exactly does this dataset get used?</p>
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DatasetsUsage;
