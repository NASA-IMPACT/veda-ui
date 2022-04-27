import React from 'react';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import MdxContent from '$components/common/mdx-content';

import { useThematicArea } from '$utils/thematics';

function About() {
  const thematic = useThematicArea();

  if (!thematic) throw resourceNotFound();
  console.log(thematic.data);
  return (
    <PageMainContent>
      <LayoutProps
        title={`About ${thematic.data.name}`}
        description={thematic.data.description}
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
