import React from 'react';

import { LayoutProps } from '../../common/layout-root';

import { resourceNotFound } from '../../uhoh';
import { PageMainContent } from '../../../styles/page';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDataset
} from '../../../utils/thematics';

import PageLocalNav from '../../common/page-local-nav';
import PageHero from '../../common/page-hero';
import { FoldProse } from '../../common/fold';

function DatasetsOverview() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();
  const pageMdx = useMdxPageLoader(dataset?.content);

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <>
      <LayoutProps title={`${dataset.data.name} overview`} />
      <PageLocalNav
        title={dataset.data.name}
        thematic={thematic}
        dataset={dataset}
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
