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
      <LayoutProps
        title={`${dataset.data.name} Usage`}
        description={dataset.data.description}
        thumbnail={dataset.data.media?.src}
      />
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
        <PageHero title={`${dataset.data.name} Usage`} />
        <FoldProse>
          {
            dataset.data.usage?.url && dataset.data.usage?.title ?
              <p>Check out how to use this dataset in this example notebook: <a href={dataset.data.usage?.url}>{dataset.data.usage?.title}</a></p> :
              <p>Coming Soon!</p>
          }
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DatasetsUsage;
