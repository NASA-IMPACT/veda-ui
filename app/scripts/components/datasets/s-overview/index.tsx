import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { CollecticonCompass } from '@devseed-ui/collecticons';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import { PageActions, PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import RelatedContent from '$components/common/related-content';
import { NotebookConnectButton } from '$components/common/notebook-connect';

import {
  TAXONOMY_GRADE,
  TAXONOMY_UNCERTAINTY,
} from '$utils/veda-data/taxonomies';
import {
  useDataset
} from '$utils/veda-data';
import { DATASETS_PATH, getDatasetExplorePath } from '$utils/routes';
import { ContentTaxonomy } from '$components/common/content-taxonomy';
import { DatasetClassification } from '$components/common/dataset-classification';
import { veda_faux_module_datasets } from '$data-layer/datasets';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

function DatasetsOverview() {
  const dataset = useDataset(veda_faux_module_datasets);

  if (!dataset) throw resourceNotFound();

  const taxonomies = dataset.data.taxonomy.filter(
    (t) => ![TAXONOMY_UNCERTAINTY, TAXONOMY_GRADE].includes(t.name)
  );

  return (
    <>
      <LayoutProps
        title={`${dataset.data.name} - Overview`}
        description={dataset.data.description}
        thumbnail={dataset.data.media?.src}
      />

      <PageMainContent>
        <PageHero
          title={dataset.data.name}
          description={dataset.data.description}
          renderBetaBlock={() => (
            <PageActions>
              {dataset.data.disableExplore !== true && (
                <Button
                  forwardedAs={Link}
                  to={getDatasetExplorePath(dataset.data)}
                  size='large'
                  variation='achromic-outline'
                >
                  <CollecticonCompass />
                  Explore data
                </Button>
              )}
              <NotebookConnectButton
                dataset={dataset.data}
                size='large'
                compact={false}
                variation='achromic-outline'
              />
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
