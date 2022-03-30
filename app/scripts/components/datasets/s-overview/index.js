import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { LayoutProps } from '$components/common/layout-root';
import { resourceNotFound } from '$components/uhoh';
import { PageActions, PageLead, PageMainContent } from '$styles/page';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import PageHero from '$components/common/page-hero';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDataset
} from '$utils/thematics';

import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import Image from '$components/common/images/';
import { ContentBlockProse } from '$styles/content-block';
import Chart from '$components/discoveries/chart/';
import { Caption } from '$components/common/images/';

import { datasetExplorePath, thematicDatasetsPath } from '$utils/routes';
import { Button } from '@devseed-ui/button';
import { Link } from 'react-router-dom';

function DatasetsOverview() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();
  const pageMdx = useMdxPageLoader(dataset?.content);

  if (!thematic || !dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps title={`${dataset.data.name} Overview`} />
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
          title={`${dataset.data.name} Overview`}
          renderBetaBlock={() => (
            <>
              <PageLead>{dataset.data.description}</PageLead>
              <PageActions>
                <Button
                  forwardedAs={Link}
                  to={datasetExplorePath(thematic, dataset)}
                  size='large'
                  variation='achromic-outline'
                >
                  Explore the data
                </Button>
              </PageActions>
            </>
          )}
          coverSrc={dataset.data.media?.src}
          coverAlt={dataset.data.media?.alt}
          attributionAuthor={dataset.data.media?.author?.name}
          attributionUrl={dataset.data.media?.author?.url}
        />
        {pageMdx.status === 'loading' && <p>Loading page content</p>}
        {pageMdx.status === 'success' && (
          <MDXProvider
            components={{
              Block,
              Prose: ContentBlockProse,
              Figure: ContentBlockFigure,
              Caption,
              Image,
              Chart
            }}
          >
            <pageMdx.MdxContent />
          </MDXProvider>
        )}
      </PageMainContent>
    </>
  );
}

export default DatasetsOverview;
