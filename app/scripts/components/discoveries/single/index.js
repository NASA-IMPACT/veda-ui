import React from 'react';

import { LayoutProps } from '../../common/layout-root';
import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';
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
      <Constrainer>
        <h1>Discovery: {discovery.data.name}</h1>

        {pageMdx.status === 'loading' && <p>Loading page content</p>}
        {pageMdx.status === 'success' && <pageMdx.MdxContent />}
      </Constrainer>
    </PageMainContent>
  );
}

export default DiscoveriesSingle;
