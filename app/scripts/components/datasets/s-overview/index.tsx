import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { CollecticonCompass, CollecticonArrowUpRight } from '@devseed-ui/collecticons';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import { PageActions, PageMainContent } from '$styles/page';
import { DatasetsLocalMenu } from '$components/common/page-local-nav';
import PageHero from '$components/common/page-hero';
import RelatedContent from '$components/common/related-content';
import { NotebookConnectButton } from '$components/common/notebook-connect';

import {
  allDatasetsProps,
  TAXONOMY_GRADE,
  TAXONOMY_UNCERTAINTY,
  useDataset
} from '$utils/veda-data';
import { DATASETS_PATH, getDatasetExplorePath, getDatasetBrowserPath } from '$utils/routes';
import { ContentTaxonomy } from '$components/common/content-taxonomy';
import { DatasetClassification } from '$components/common/dataset-classification';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

function DatasetsOverview() {
  const dataset = useDataset();

  if (!dataset) throw resourceNotFound();

  const taxonomies = dataset.data.taxonomy.filter(
    (t) => ![TAXONOMY_UNCERTAINTY, TAXONOMY_GRADE].includes(t.name)
  );

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
          description={dataset.data.description}
          renderBetaBlock={() => (
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
                {dataset.data.dataPath && (
                  <a
                    href={getDatasetBrowserPath(dataset.data)}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Button size='large' variation='achromic-outline'>
                      <CollecticonArrowUpRight />
                      Download
                    </Button>
                  </a>
                )}
              </PageActions>
          )}
          renderDetailsBlock={() => (
            <>
              <ContentTaxonomy taxonomy={taxonomies} linkBase={DATASETS_PATH} />
              <DatasetClassification dataset={dataset.data} />
            </>
          )}
          coverSrc={dataset.data.media?.src}
          coverAlt={dataset.data.media?.alt}
          attributionAuthor={dataset.data.media?.author?.name}
          attributionUrl={dataset.data.media?.author?.url}
        />

        <MdxContent loader={dataset.content} />

        {!!dataset.data.related?.length && (
          <RelatedContent related={dataset.data.related} />
        )}
      </PageMainContent>
    </>
  );
}

export default DatasetsOverview;
