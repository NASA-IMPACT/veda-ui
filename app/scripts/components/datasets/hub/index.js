import React from 'react';
import styled from 'styled-components';
import { glsp, listReset, themeVal } from '@devseed-ui/theme-provider';
import { Link } from 'react-router-dom';

import { LayoutProps } from '../../common/layout-root';
import { resourceNotFound } from '../../uhoh';
import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';

import { useThematicArea } from '../../../utils/thematics';

const List = styled.ul`
  ${listReset()}
  display: flex;
  gap: ${glsp(2)};
  margin-top: ${glsp(3)};

  li {
    padding: ${glsp()};
    border-radius: ${themeVal('shape.rounded')};
    box-shadow: ${themeVal('boxShadow.elevationC')};
  }
`;

function DatasetsHub() {
  const thematic = useThematicArea();
  if (!thematic) return resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title='Datasets' />
      <Constrainer>
        <h1>{thematic.data.name} Datasets</h1>
        <List>
          {thematic.data.datasets.map((t) => (
            <li key={t.id}>
              <Link to={`${t.id}`}>
                <h2>{t.name}</h2>
              </Link>
            </li>
          ))}
        </List>
      </Constrainer>
    </PageMainContent>
  );
}

export default DatasetsHub;
