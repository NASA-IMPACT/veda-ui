import React from 'react';
import { Button } from '@devseed-ui/button';
import { Link } from 'react-router-dom';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import { PageActions, PageLead, PageMainContent } from '$styles/page';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import PageHero from '$components/common/page-hero';
import MdxContent from '$components/common/mdx-content';
import RelatedContent from '$components/common/blocks/related-content';

import { useThematicArea, useThematicAreaDataset } from '$utils/thematics';
import { datasetExplorePath, thematicDatasetsPath } from '$utils/routes';

function DatasetsOverview() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!thematic || !dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps
        title={`${dataset.data.name} Overview`}
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
        <MdxContent loader={dataset?.content} />
        {dataset.data.related?.length > 0 && (
          <RelatedContent related={dataset.data.related} />
        )}
      </PageMainContent>
    </>
  );
}

export default DatasetsOverview;
