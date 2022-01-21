import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';

import { LayoutProps } from '../../common/layout-root';
import { resourceNotFound } from '../../uhoh';
import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';

import {
  useThematicArea,
  useThematicAreaDataset
} from '../../../utils/thematics';
import {
  datasetExplorePath,
  datasetOverviewPath,
  datasetUsagePath
} from '../../../utils/routes';

function DatasetsExplore() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={dataset.data.name} />
      <Constrainer>
        <h1>Dataset explore: {dataset.data.name}</h1>

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
      </Constrainer>
    </PageMainContent>
  );
}

export default DatasetsExplore;
