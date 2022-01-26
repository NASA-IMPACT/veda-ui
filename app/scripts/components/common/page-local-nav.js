import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { reveal } from '@devseed-ui/animation';
import { createHeadingStyles } from '@devseed-ui/typography';

import { glsp, themeVal, divide } from '@devseed-ui/theme-provider';
import { variableGlsp } from '../../styles/variable-utils';
import {
  datasetExplorePath,
  datasetOverviewPath,
  datasetUsagePath
} from '../../utils/routes';

const innerSpacingCss = (size) => css`
  gap: ${glsp(themeVal(`layout.glspMultiplier.${size}`))};
  padding: ${glsp(
    divide(themeVal(`layout.glspMultiplier.${size}`), 2),
    themeVal(`layout.glspMultiplier.${size}`)
  )};
`;

const PageLocalNavSelf = styled.nav`
  ${innerSpacingCss('xsmall')}
  position: sticky;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(0.75, 1)};
  background: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  animation: ${reveal} 0.32s ease 0s 1;
`;

const LocalTitle = styled.div`
  ${createHeadingStyles({ size: 'small' })}

  a,
  a:visited {
    color: ${themeVal('color.surface')};
    text-decoration: none;
  }
`;

const LocalMenu = styled.ul`
  margin: 0 0 0 auto;
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${glsp()};

  a,
  a:visited {
    color: inherit;
    text-decoration: none;
  }
`;

function PageLocalNav(props) {
  const { thematic, dataset, title } = props;

  return (
    <PageLocalNavSelf>
      <LocalTitle>
        <Link to={datasetOverviewPath(thematic, dataset)}>{title}</Link>
      </LocalTitle>
      <LocalMenu>
        <li>
          <Link to={datasetOverviewPath(thematic, dataset)}>Overview</Link>
        </li>
        <li>
          <Link to={datasetExplorePath(thematic, dataset)}>Exploration</Link>
        </li>
        <li>
          <Link to={datasetUsagePath(thematic, dataset)}>Usage</Link>
        </li>
      </LocalMenu>
    </PageLocalNavSelf>
  );
}

export default PageLocalNav;

PageLocalNav.propTypes = {
  title: T.string,
  thematic: T.object,
  dataset: T.object
};
