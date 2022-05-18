import React from 'react';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import PageLocalNav from '$components/common/page-local-nav';
import { PageMainContent } from '$styles/page';
import MdxContent from '$components/common/mdx-content';
import RelatedContent from '$components/common/blocks/related-content';

import { useThematicArea, useThematicAreaDiscovery } from '$utils/thematics';
import { thematicDiscoveriesPath } from '$utils/routes';

function DiscoveriesSingle() {
  const thematic = useThematicArea();
  const discovery = useThematicAreaDiscovery();

  if (!thematic || !discovery) throw resourceNotFound();

  const { media, related } = discovery.data;

  return (
    <>
      <LayoutProps
        title={discovery.data.name}
        description={discovery.data.description}
        thumbnail={media?.src}
      />
      <PageLocalNav
        parentName='Discovery'
        parentLabel='Discoveries'
        parentTo={thematicDiscoveriesPath(thematic)}
        items={thematic.data.discoveries}
        currentId={discovery.data.id}
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
          <MdxContent loader={discovery?.content} />
          {related?.length > 0 && <RelatedContent related={related} />}
        </article>
      </PageMainContent>
    </>
  );
}

export default DiscoveriesSingle;
