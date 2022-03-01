import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Prose } from '@devseed-ui/typography';

import Constrainer from '../../styles/constrainer';
import SandboxTypography from './typography';
import SandboxUniGridder from './gridder';

function Sandbox() {
  return (
    <Routes>
      <Route path='typography' element={<SandboxTypography />} />
      <Route path='gridder' element={<SandboxUniGridder />} />
      <Route
        index
        element={
          <Constrainer>
            <h1>Sandbox</h1>
            <Prose>
              <h6>Contents</h6>
              <ol>
                <li>
                  <Link to='typography'>Typography</Link>
                </li>
              </ol>
            </Prose>
          </Constrainer>
        }
      />
    </Routes>
  );
}

export default Sandbox;
