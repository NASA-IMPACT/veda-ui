import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDataset
} from '$utils/thematics';
import { thematicDatasetsPath } from '$utils/routes';

function DatasetsOverview() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();
  const pageMdx = useMdxPageLoader(dataset?.content);

  if (!thematic || !dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps title={`${dataset.data.name} overview`} />
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
        <PageHero
          title={dataset.data.name}
          description={dataset.data.description}
        />
        <FoldProse>
          {pageMdx.status === 'loading' && <p>Loading page content</p>}
          {pageMdx.status === 'success' && <pageMdx.MdxContent />}
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DatasetsOverview;
