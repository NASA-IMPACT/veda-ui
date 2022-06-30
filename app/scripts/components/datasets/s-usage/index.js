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
import EmptyHub from '$components/common/empty-hub';

function DatasetsUsage() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!thematic || !dataset) throw resourceNotFound();

  const datasetUsage = dataset.data.usage;

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
          {datasetUsage?.url && datasetUsage?.title ? (
            <p>
              Check out how to use this dataset in this example notebook (using <code>collection='{dataset.data.layers[0].id}'</code>):{' '}
              <a href={datasetUsage.url}>{datasetUsage.title}</a>.
            </p>
          ) : (
            <EmptyHub>Coming soon!</EmptyHub>
          )}
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DatasetsUsage;
