import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { resourceNotFound } from '$components/uhoh';
import PageLocalNav from '$components/common/page-local-nav';
import { PageLead, PageMainContent } from '$styles/page';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDiscovery
} from '$utils/thematics';

import { thematicDiscoveriesPath } from '$utils/routes';

import { ContentBlockProse } from '$styles/content-block';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import Image, { Caption } from '$components/common/blocks/images/';
import Chart from '$components/common/blocks/chart/';
import Map from '$components/common/blocks/block-map';

function DiscoveriesSingle() {
  const thematic = useThematicArea();
  const discovery = useThematicAreaDiscovery();
  const pageMdx = useMdxPageLoader(discovery?.content);

  if (!thematic || !discovery) throw resourceNotFound();

  const { media } = discovery.data;

  return (
    <>
      <LayoutProps title={discovery.data.name} />
      <PageLocalNav
        parentName='Discovery'
        parentLabel='Discoveries'
        parentTo={thematicDiscoveriesPath(thematic)}
        items={thematic.data.discoveries}
        currentId={discovery.data.id}
      />
      <PageMainContent>
        <PageHero
          title={discovery.data.name}
          detailsContent={<PageLead>{discovery.data.description}</PageLead>}
          publishedDate={discovery.data.pubDate}
          coverSrc={media?.src}
          coverAlt={media?.alt}
          attributionAuthor={media?.author?.name}
          attributionUrl={media?.author?.url}
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
              Chart,
              Map
            }}
          >
            <pageMdx.MdxContent />
          </MDXProvider>
        )}
      </PageMainContent>
    </>
  );
}

export default DiscoveriesSingle;
