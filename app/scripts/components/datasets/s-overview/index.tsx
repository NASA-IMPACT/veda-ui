import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { CollecticonCompass } from '@devseed-ui/collecticons';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import { PageActions, PageLead, PageMainContent } from '$styles/page';
import { DatasetsLocalMenu } from '$components/common/page-local-nav';
import PageHero from '$components/common/page-hero';
import RelatedContent from '$components/common/related-content';
import { NotebookConnectButton } from '$components/common/notebook-connect';

import { allDatasetsProps, useDataset } from '$utils/veda-data';
import { DATASETS_PATH, getDatasetExplorePath } from '$utils/routes';
import { ContentTaxonomy } from '$components/common/content-taxonomy';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

function DatasetsOverview() {
  const dataset = useDataset();

  if (!dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps
        title={`${dataset.data.name} Overview`}
        description={dataset.data.description}
        thumbnail={dataset.data.media?.src}
        localNavProps={{
          parentName: 'Dataset',
          parentLabel: 'Datasets',
          parentTo: DATASETS_PATH,
          items: allDatasetsProps,
          currentId: dataset.data.id,
          localMenuCmp: <DatasetsLocalMenu dataset={dataset} />
        }}
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
                  to={getDatasetExplorePath(dataset.data)}
                  size='large'
                  variation='achromic-outline'
                >
                  <CollecticonCompass />
                  Explore data
                </Button>
                <NotebookConnectButton
                  dataset={dataset.data}
                  size='large'
                  compact={false}
                  variation='achromic-outline'
                />
              </PageActions>
            </>
          )}
          coverSrc={dataset.data.media?.src}
          coverAlt={dataset.data.media?.alt}
          attributionAuthor={dataset.data.media?.author?.name}
          attributionUrl={dataset.data.media?.author?.url}
        />

        <ContentTaxonomy taxonomy={dataset.data.taxonomy} />

        <MdxContent loader={dataset.content} />

        {!!dataset.data.related?.length && (
          <RelatedContent related={dataset.data.related} />
        )}
      </PageMainContent>
    </>
  );
}

export default DatasetsOverview;
