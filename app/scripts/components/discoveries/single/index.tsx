import React, { lazy } from 'react';
import { getString } from 'veda';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import RelatedContent from '$components/common/related-content';
import { DISCOVERIES_PATH } from '$utils/routes';
import { useDiscovery, allDiscoveriesProps } from '$utils/veda-data';
import { ContentTaxonomy } from '$components/common/content-taxonomy';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

function DiscoveriesSingle() {
  const discovery = useDiscovery();

  if (!discovery) throw resourceNotFound();

  const { media, related } = discovery.data;

  return (
    <>
      <LayoutProps
        title={discovery.data.name}
        description={discovery.data.description}
        thumbnail={media?.src}
        localNavProps={{
          parentName: getString('stories').singular,
          parentLabel: getString('stories').plural,
          parentTo: DISCOVERIES_PATH,
          items: allDiscoveriesProps,
          currentId: discovery.data.id
        }}
      />

      <PageMainContent>
        <article>
          <PageHero
            title={discovery.data.name}
            description={discovery.data.description}
            publishedDate={discovery.data.pubDate}
            coverSrc={media?.src}
            coverAlt={media?.alt}
            attributionAuthor={media?.author?.name}
            attributionUrl={media?.author?.url}
          />
          
          <ContentTaxonomy taxonomy={discovery.data.taxonomy} />

          <MdxContent loader={discovery.content} />
          
          {!!related?.length && <RelatedContent related={related} />}
        </article>
      </PageMainContent>
    </>
  );
}

export default DiscoveriesSingle;
