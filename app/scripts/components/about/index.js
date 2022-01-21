import React from 'react';

import { LayoutProps } from '../common/layout-root';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';
import { resourceNotFound } from '../uhoh';

import { useThematicArea } from '../../utils/thematics';

function About() {
  const thematic = useThematicArea();
  if (!thematic) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={`About ${thematic.name}`} />
      <Constrainer>
        <h1>About: {thematic.name}</h1>
        <p>
          Here you can find some information about this specific thematic area.
        </p>
      </Constrainer>
    </PageMainContent>
  );
}

export default About;
