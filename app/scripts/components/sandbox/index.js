import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
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
import { USWDSColors } from './colors';
import Pagination from './pagination';
import Widgets from './widgets';
import LightMap from './lightmap';
import SandboxUswdsCards from './cards';
import {
  FullscreenWidget,
  FullpageModalWidget
} from '$components/common/widget';
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
    id: 'legacy-colors',
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
  },
  {
    id: 'colors',
    name: 'USWDS Colors',
    component: USWDSColors
  },
  {
    id: 'pagination',
    name: 'USWDS Pagination',
    component: Pagination
  },
  {
    id: 'widgets',
    name: 'USWDS Widgets',
    component: Widgets
  },
  {
    id: 'lightmap',
    name: 'Block Map without Data collection',
    component: LightMap
  },
  {
    id: 'uswds-cards',
    name: 'USWDS Cards',
    component: SandboxUswdsCards
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

export const HugResetter = styled.div`
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
                <Grid row gap={3}>
                  <Grid col={12} className='margin-top-2 margin-bottom-3'>
                    <h2>Browse USWDS Components</h2>
                  </Grid>

                  <Grid col={4} className='margin-bottom-3'>
                    <Card
                      linkLabel='View more'
                      title='USWDS Colors'
                      to='colors'
                    />
                  </Grid>
                  <Grid col={4} className='margin-bottom-3'>
                    <Card
                      linkLabel='View more'
                      title='USWDS Pagination'
                      to='pagination'
                    />
                  </Grid>
                  <Grid col={4} className='margin-bottom-3'>
                    <Card
                      linkLabel='View more'
                      title='USWDS Cards'
                      to='uswds-cards'
                    />
                  </Grid>

                  <Grid col={12} className='margin-top-2 margin-bottom-3'>
                    <h2>Explore widget possibilities</h2>
                  </Grid>
                  <Grid col={6} className='margin-bottom-3'>
                    <FullscreenWidget heading='Fullscreen API'>
                      <p>
                        This is using the fullscreen API, displaying the content
                        in full screen size.
                      </p>
                      <img
                        src='https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXZrcmlkeGVreDFlbGRpNm9leTMxOTh1ZTFocHhtdmxhODZvaWt1biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif'
                        width='457'
                        height='480'
                      />
                      <p>
                        <a href='https://giphy.com/gifs/cat-kitten-computer-3oKIPnAiaMCws8nOsE'>
                          via GIPHY
                        </a>
                      </p>
                    </FullscreenWidget>
                  </Grid>
                  <Grid col={6} className='margin-bottom-3'>
                    <FullpageModalWidget heading='Fullpage Modal'>
                      <p>
                        This is using the a modal approach with a micro
                        animation. The extend spans the whole page, but does not
                        cover the browser tools.
                      </p>
                      <img
                        src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXc3azJsZmxoaTE1cXR4dDlvem5taHFlMXJwOWcwZDJrMnoza2YzMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q5Wtr34IBE1KOYHkyN/giphy.gif'
                        width='480'
                        height='360'
                      />
                      <p>
                        <a href='https://giphy.com/gifs/epic-bots-epicbots-q5Wtr34IBE1KOYHkyN'>
                          via GIPHY
                        </a>
                      </p>
                    </FullpageModalWidget>
                  </Grid>
                  <Grid col={4} className='margin-bottom-3'>
                    <Card
                      linkLabel='View more'
                      title='USWDS Widgets'
                      to='widgets'
                    />
                  </Grid>
                  <Grid col={4} className='margin-bottom-3'>
                    <Card
                      linkLabel='View more'
                      title='No Data Collection Map'
                      to='lightmap'
                    />
                  </Grid>
                </Grid>
              </GridContainer>
            </HugResetter>

            <HugResetter>
              <GridContainer>
                <Grid row>
                  <Grid col={12} className='margin-top-2 margin-bottom-3'>
                    <h2>Browse Legacy Components</h2>
                  </Grid>
                </Grid>
                <Grid row gap={3}>
                  {pages
                    .filter((p) => !p.name.startsWith('USWDS'))
                    .map((p) => (
                      <Grid col={4} key={p.id} className='margin-bottom-3'>
                        <Card linkLabel='View more' title={p.name} to={p.id} />
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
