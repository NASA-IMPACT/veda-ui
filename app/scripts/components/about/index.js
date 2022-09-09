import React, { lazy } from 'react';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

import { useThematicArea } from '$utils/thematics';

function About() {
  const thematic = useThematicArea();

  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps
        title={`About ${thematic.data.name}`}
        description={thematic.data.description}
        thumbnail={thematic.data.media?.src}
      />
      <PageHero
        title={thematic.data.about?.title || 'n/a'}
        description={thematic.data.about?.description}
      />
      <MdxContent loader={thematic?.content} />
    </PageMainContent>
  );
}

export default About;
