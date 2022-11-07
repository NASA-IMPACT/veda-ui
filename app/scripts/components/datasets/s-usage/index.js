import React from 'react';

import { LayoutProps } from '$components/common/layout-root';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';
import { DatasetsLocalMenu } from '$components/common/page-local-nav';
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

  const layerIdsSet = dataset.data.layers.reduce(
    (acc, layer) => acc.add(layer.stacCol),
    new Set()
  );

  return (
    <>
      <LayoutProps
        title={`${dataset.data.name} Usage`}
        description={dataset.data.description}
        thumbnail={dataset.data.media?.src}
        localNavProps={{
          parentName: 'Dataset',
          parentLabel: 'Datasets',
          parentTo: thematicDatasetsPath(thematic),
          items: thematic.data.datasets,
          currentId: dataset.data.id,
          localMenuCmp: (
            <DatasetsLocalMenu thematic={thematic} dataset={dataset} />
          )
        }}
      />

      <PageMainContent>
        <PageHero title={`${dataset.data.name} Usage`} />
        <FoldProse>
          {datasetUsage?.length > 0 ? (
            <>
              <p>
                Check out how to use this dataset:{' '}
                {datasetUsage.map((du) => (
                  <li>{du.description}:{' '}<a href={du.url}>{du.title}</a></li>
                ))}
              </p>
              <p>
                For reference, the following STAC collection ID&apos;s are
                associated with this dataset:
              </p>
              <ul>
                {Array.from(layerIdsSet).map((id) => (
                  <li key={id}>
                    <code>{id}</code>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyHub>Coming soon!</EmptyHub>
          )}
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DatasetsUsage;
