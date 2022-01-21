import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';

import { LayoutProps } from '../../common/layout-root';
import { resourceNotFound } from '../../uhoh';
import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDataset
} from '../../../utils/thematics';
import {
  datasetExplorePath,
  datasetOverviewPath,
  datasetUsagePath
} from '../../../utils/routes';

function DatasetsOverview() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();
  const pageMdx = useMdxPageLoader(dataset?.content);

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={`${dataset.data.name} overview`} />
      <Constrainer>
        <h1>Dataset overview: {dataset.data.name}</h1>

        <Button
          forwardedAs={Link}
          to={datasetExplorePath(thematic, dataset)}
          variation='primary-outline'
        >
          Explore
        </Button>
        <span>or</span>
        <Button
          forwardedAs={Link}
          to={datasetOverviewPath(thematic, dataset)}
          variation='primary-outline'
        >
          Overview
        </Button>
        <span>or</span>
        <Button
          forwardedAs={Link}
          to={datasetUsagePath(thematic, dataset)}
          variation='primary-outline'
        >
          Usage
        </Button>

        {pageMdx.status === 'loading' && <p>Loading page content</p>}
        {pageMdx.status === 'success' && <pageMdx.MdxContent />}
      </Constrainer>
    </PageMainContent>
  );
}

export default DatasetsOverview;
