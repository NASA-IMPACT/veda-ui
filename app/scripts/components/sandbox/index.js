import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import SandboxTypography from './typography';
import SandboxHug from './hug';
import SandboxMap from './map';
import SandboxExplorationMap from './exploration-map';
import SandboxMapBlock from './map-block';
import SandboxContentBlocks from './content-blocks';
import SandboxCards from './cards';
import SandboxMDXPage from './mdx-page';
import SandboxMDXScrolly from './mdx-scrollytelling';
import SandboxAOI from './aoi';
import SandboxOverride from './override';
import SandboxDateslider from './dateslider';
import SandboxChart from './mdx-chart';
import SandboxAnalysisChart from './analysis-chart';
import SandboxRequest from './request';
import SandboxColors from './colors';
import SandboxMDXEditor from './mdx-editor';
import SandboxTable from './table';
import SandboxLayerInfo from './layer-info';
import { resourceNotFound } from '$components/uhoh';
import { Card } from '$components/common/card';
import { CardListGrid } from '$components/common/card/styles';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import PageHero from '$components/common/page-hero';
import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';

const pages = [
  {
    id: 'typography',
    name: 'Typography',
    component: SandboxTypography
  },
  {
    id: 'hug',
    name: 'Human Universal Gridder (Hug)',
    component: SandboxHug
  },
  {
    id: 'map',
    name: 'Mapbox map',
    component: SandboxMap
  },
  {
    id: 'exploration-map',
    name: 'Exploration map',
    component: SandboxExplorationMap
  },
  {
    id: 'map-block',
    name: 'Map block',
    component: SandboxMapBlock
  },
  {
    id: 'content-blocks',
    name: 'Content Blocks',
    component: SandboxContentBlocks
  },
  {
    id: 'mdx-page',
    name: 'Mdx page',
    component: SandboxMDXPage
  },
  {
    id: 'mdx-scrolly',
    name: 'Scrollytelling',
    component: SandboxMDXScrolly
  },
  {
    id: 'mdx-chart',
    name: 'Chart',
    component: SandboxChart
  },
  {
    id: 'analysis-chart',
    name: 'Analysis Page Chart',
    component: SandboxAnalysisChart
  },
  {
    id: 'cards',
    name: 'Cards',
    component: SandboxCards
  },
  {
    id: 'aoi',
    name: 'Map AOI',
    component: SandboxAOI
  },
  {
    id: 'override',
    name: 'Override',
    component: SandboxOverride
  },
  {
    id: 'dateslider',
    name: 'Dateslider',
    component: SandboxDateslider
  },
  {
    id: 'request',
    name: 'Requests',
    component: SandboxRequest
  },
  {
    id: 'colors',
    name: 'Colors',
    component: SandboxColors
  },
  {
    id: 'mdxeditor',
    name: 'Story Editor ⚠️EXPERIMENTAL',
    component: SandboxMDXEditor
  },
  {
    id: 'sandboxtable',
    name: 'Table',
    component: SandboxTable
  },
  {
    id: 'sandboxLayerInfo',
    name: 'Layer Info',
    component: SandboxLayerInfo
  }
];

function SandboxLayout() {
  const { pId } = useParams();

  const page = pages.find((p) => p.id === pId);
  if (!page) throw resourceNotFound();

  return (
    <>
      <LayoutProps
        title={`Sandbox - ${page.name}`}
        hideFooter={page.noFooter}
      />

      <PageMainContent>
        {!page.noHero ? <PageHero title={page.name} /> : false}
        <page.component />
      </PageMainContent>
    </>
  );
}

function Sandbox() {
  return (
    <Routes>
      <Route path=':pId' element={<SandboxLayout />} />
      <Route
        index
        element={
          <PageMainContent>
            <LayoutProps title='Sandbox' />
            <PageHero title='Sandbox' />
            <Fold>
              <FoldHeader>
                <FoldTitle>Browse</FoldTitle>
              </FoldHeader>
              <CardListGrid>
                {pages.map((p) => (
                  <li key={p.id}>
                    <Card linkLabel='View more' linkTo={p.id} title={p.name} />
                  </li>
                ))}
              </CardListGrid>
            </Fold>
          </PageMainContent>
        }
      />
    </Routes>
  );
}

export default Sandbox;
