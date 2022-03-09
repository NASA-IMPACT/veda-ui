import React from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold } from '$components/common/fold';
import { Card, CardList } from '$styles/card';
import PageLocalNav from '$components/common/page-local-nav';
import { resourceNotFound } from '$components/uhoh';

import SandboxTypography from './typography';
import SandboxHug from './hug';
import SandboxMap from './map';
import SandboxContentBlocks from './content-blocks';

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
  }
];

function SandboxLayout() {
  const { pId } = useParams();

  const page = pages.find((p) => p.id === pId);
  if (!page) throw resourceNotFound();

  return (
    <>
      <LayoutProps title={`Sandbox - ${page.name}`} />
      <PageLocalNav
        parentName='Sandbox'
        parentLabel='Sandbox'
        parentTo='/sandbox'
        items={pages}
        currentId={pId}
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
              <CardList>
                {pages.map((p) => (
                  <li key={p.id}>
                    <Card>
                      <h2>
                        <Link to={p.id}>{p.name}</Link>
                      </h2>
                    </Card>
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
