import React from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { GridContainer, Grid } from '@trussworks/react-uswds';

import SandboxTypography from './legacy/typography';
import SandboxHug from './legacy/hug';
import SandboxExplorationMap from './legacy/exploration-map';
import SandboxMapBlock from './legacy/map-block';
import SandboxContentBlocks from './legacy/content-blocks';
import SandboxCards from './legacy/cards';
import SandboxMDXPage from './legacy/mdx-page';
import SandboxMDXScrolly from './legacy/mdx-scrollytelling';
import SandboxChart from './legacy/mdx-chart';
import SandboxColors from './legacy/colors';
import SandboxMDXEditor from './legacy/mdx-editor';
import SandboxTable from './legacy/table';
import SandboxLayerInfo from './legacy/layer-info';
import SandboxOverride from './override';
import { resourceNotFound } from '$components/uhoh';
import { Card } from '$components/common/card';
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
    id: 'cards',
    name: 'Cards',
    component: SandboxCards
  },
  {
    id: 'override',
    name: 'Override',
    component: SandboxOverride
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

const HugResetter = styled.div`
  /* To escape from HUG grid */
`;

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
            <HugResetter>
              <GridContainer>
                <Grid row>
                  <Grid col='12'>
                    <h2>Browse USWDS Components</h2>
                  </Grid>
                </Grid>
              </GridContainer>
            </HugResetter>

            <HugResetter>
              <GridContainer>
                <Grid row>
                  <Grid col='12'>
                    <h2>Browse Legacy Components</h2>
                  </Grid>
                </Grid>
                <Grid row gap={3}>
                  {pages.map((p) => (
                    <Grid col='4' key={p.id} className='margin-bottom-3'>
                      <Card
                        linkLabel='View more'
                        title={p.name}
                        linkProperties={{
                          linkTo: p.id,
                          LinkElement: Link,
                          pathAttributeKeyName: 'to'
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </GridContainer>
            </HugResetter>
          </PageMainContent>
        }
      />
    </Routes>
  );
}

export default Sandbox;
