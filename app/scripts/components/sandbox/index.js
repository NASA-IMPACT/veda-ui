import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { PageMainContent } from '$styles/page';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold } from '$components/common/fold';
import { Card, CardList } from '$styles/card';

import SandboxTypography from './typography';
import SandboxHug from './hug';

function Sandbox() {
  return (
    <Routes>
      <Route path='typography' element={<SandboxTypography />} />
      <Route path='hug' element={<SandboxHug />} />
      <Route
        index
        element={
          <PageMainContent>
            <LayoutProps title='Sandbox' />
            <PageHero title='Sandbox' />
            <Fold>
              <CardList>
                <li>
                  <Card>
                    <h2>
                      <Link to='typography'>Typography</Link>
                    </h2>
                  </Card>
                </li>
                <li>
                  <Card>
                    <h2>
                      <Link to='hug'>Human Universal Gridder (Hug)</Link>
                    </h2>
                  </Card>
                </li>
              </CardList>
            </Fold>
          </PageMainContent>
        }
      />
    </Routes>
  );
}

export default Sandbox;
