import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { LayoutProps } from '../common/layout-root';

import { PageMainContent } from '../../styles/page';
import { resourceNotFound } from '../uhoh';
import PageHero from '../common/page-hero';

import { useMdxPageLoader, useThematicArea } from '../../utils/thematics';

import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import Image, { Caption } from '$components/common/blocks/images/';
import { ContentBlockProse } from '$styles/content-block';
import Chart from '$components/common/blocks/chart/';

function About() {
  const thematic = useThematicArea();
  const pageMdx = useMdxPageLoader(thematic?.content);

  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={`About ${thematic.data.name}`} />
      <PageHero
        title={thematic.data.about?.title || 'n/a'}
        description={thematic.data.about?.description}
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
  );
}

export default About;
