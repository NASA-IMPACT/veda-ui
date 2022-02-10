import React from 'react';

import { LayoutProps } from '../common/layout-root';
import { FoldProse } from '../common/fold';

import { PageMainContent } from '../../styles/page';
import { resourceNotFound } from '../uhoh';
import PageHero from '../common/page-hero';

import { useMdxPageLoader, useThematicArea } from '../../utils/thematics';

function About() {
  const thematic = useThematicArea();
  const pageMdx = useMdxPageLoader(thematic?.content);

  if (!thematic) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={`About ${thematic.data.name}`} />
      <PageHero
        title={thematic.data.about?.title || 'n/a'}
        description={thematic.data.about?.description}
      />
      <FoldProse>
        {pageMdx.status === 'loading' && <p>Loading page content</p>}
        {pageMdx.status === 'success' && <pageMdx.MdxContent />}
      </FoldProse>
    </PageMainContent>
  );
}

export default About;
