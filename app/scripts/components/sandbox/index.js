import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';
import { resourceNotFound } from '$components/uhoh';

import SandboxTypography from './typography';
import SandboxHug from './hug';
import SandboxMap from './map';
import SandboxContentBlocks from './content-blocks';
import SandboxCards from './cards';
import SandboxMDXPage from './mdx-page';
import SandboxMDXScrolly from './mdx-scrollytelling';
import SandboxAOI from './aoi';
import SandboxOverride from './override';
import SandboxTimeseries from './timeseries';
import SandboxChart from './mdx-chart';

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
    id: 'timeseries',
    name: 'Timeseries',
    component: SandboxTimeseries
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
        localNavProps={{
          parentName: 'Sandbox',
          parentLabel: 'Sandbox',
          parentTo: '/sandbox',
          items: pages,
          currentId: pId
        }}
      />

      <PageMainContent>
        <PageHero title={page.name} />
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
              <CardList>
                {pages.map((p) => (
                  <li key={p.id}>
                    <Card linkLabel='View more' linkTo={p.id} title={p.name} />
                  </li>
                ))}
              </CardList>
            </Fold>
          </PageMainContent>
        }
      />
    </Routes>
  );
}

export default Sandbox;
