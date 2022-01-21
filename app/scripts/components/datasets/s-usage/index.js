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

function DatasetsUsage() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={`${dataset.data.name} usage`} />
      <Constrainer>
        <h1>Dataset usage: {dataset.data.name}</h1>

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

        <p>And how exactly does this dataset get used?</p>
      </Constrainer>
    </PageMainContent>
  );
}

export default DatasetsUsage;
