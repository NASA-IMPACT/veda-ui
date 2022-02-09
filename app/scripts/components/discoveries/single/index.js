import React from 'react';

import { LayoutProps } from '../../common/layout-root';
import { PageMainContent } from '../../../styles/page';
import PageHero from '../../common/page-hero';
import FoldProse from '../../common/fold';
import { resourceNotFound } from '../../uhoh';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDiscovery
} from '../../../utils/thematics';


function DiscoveriesSingle() {
  const thematic = useThematicArea();
  const discovery = useThematicAreaDiscovery();
  const pageMdx = useMdxPageLoader(discovery?.content);

  if (!thematic || !discovery) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title={discovery.data.name} />
      <PageHero
        title={discovery.data.name}
        description={discovery.data.description}
      />
      <FoldProse>
        {pageMdx.status === 'loading' && <p>Loading page content</p>}
        {pageMdx.status === 'success' && <pageMdx.MdxContent />}
      </FoldProse>
    </PageMainContent>
  );
}

export default DiscoveriesSingle;
