import React from 'react';

import { LayoutProps } from '../common/layout-root';
import FoldProse from '../common/fold';

import { PageMainContent } from '../../styles/page';
import { resourceNotFound } from '../uhoh';

import { useThematicArea } from '../../utils/thematics';


function About() {
  const thematic = useThematicArea();
  if (!thematic) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={`About ${thematic.name}`} />
      <FoldProse>
        <h1>About</h1>
        <p>
          Here you can find some information about this specific thematic area.
        </p>
      </FoldProse>
    </PageMainContent>
  );
}

export default About;
