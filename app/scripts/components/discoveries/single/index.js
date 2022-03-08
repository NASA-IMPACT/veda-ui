import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { resourceNotFound } from '$components/uhoh';
import PageLocalNav from '$components/common/page-local-nav';
import { PageMainContent } from '$styles/page';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDiscovery
} from '$utils/thematics';

import { thematicDiscoveriesPath } from '$utils/routes';
import Chart from '$components/discoveries/chart/';

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
          description={discovery.data.description}
          publishedDate={discovery.data.pubDate}
          coverSrc={media?.src}
          coverAlt={media?.alt}
          attributionAuthor={media?.author?.name}
          attributionUrl={media?.author?.url}
        />
        <FoldProse>
          {pageMdx.status === 'loading' && <p>Loading page content</p>}
          {pageMdx.status === 'success' && (
            <MDXProvider
              components={{
                h2: (props) => <h2 {...props} className='test-class' />,
                Chart
              }}
            >
              <pageMdx.MdxContent />
            </MDXProvider>
          )}
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DiscoveriesSingle;
