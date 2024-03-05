import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { CollecticonArrowUpRight } from '@devseed-ui/collecticons';

import { variableGlsp } from '$styles/variable-utils';

function renderAttributionPosition(props) {
  const { position } = props;

  switch (position) {
    case 'top-left':
      return css`
        top: ${variableGlsp()};
        left: ${variableGlsp()};
      `;
    case 'bottom-left':
      return css`
        bottom: ${variableGlsp()};
        left: ${variableGlsp()};
      `;
    case 'bottom-right':
      return css`
        bottom: ${variableGlsp()};
        right: ${variableGlsp()};
      `;
    // top-right
    default:
      return css`
        top: ${variableGlsp()};
        right: ${variableGlsp()};
      `;
  }
}


const LinkButton = styled.button`
  /* Add button styles here */
  cursor: pointer;
  margin-right: ${glsp(0.25)};
  padding: 20rem;
  align-items: center;

  position: absolute;
  z-index: 40;
  max-width: calc(100% - ${glsp(2)}); /* stylelint-disable-line */
  height: 1.5rem;
  display: inline-flex;
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0, 0.25)};
  font-size: 0.75rem;
  background: ${themeVal('color.base-400a')};
  overflow: hidden;

  top: ${variableGlsp()};
  left: calc(${variableGlsp()} + ${'calc(10% - 0.75rem)'});

  a,
  a:visited {
    color: inherit;
    text-decoration: none;
  }
`;

function LinkAttributionCmp(props) {
  
  const { datasetId, layerId, date, compareDate} = props;

  const url = `http://localhost:9020/exploration?datasets=%5B%7B%22id%22%3A%22${layerId}%22%2C%22settings%22%3A%7B%22isVisible%22%3Atrue%2C%22opacity%22%3A100%2C%22analysisMetrics%22%3A%5B%7B%22id%22%3A%22min%22%2C%22label%22%3A%22Min%22%2C%22chartLabel%22%3A%22Min%22%2C%22themeColor%22%3A%22infographicA%22%7D%2C%7B%22id%22%3A%22mean%22%2C%22label%22%3A%22Average%22%2C%22chartLabel%22%3A%22Avg%22%2C%22themeColor%22%3A%22infographicB%22%7D%2C%7B%22id%22%3A%22max%22%2C%22label%22%3A%22Max%22%2C%22chartLabel%22%3A%22Max%22%2C%22themeColor%22%3A%22infographicC%22%7D%2C%7B%22id%22%3A%22std%22%2C%22label%22%3A%22St+Deviation%22%2C%22chartLabel%22%3A%22STD%22%2C%22themeColor%22%3A%22infographicD%22%7D%2C%7B%22id%22%3A%22median%22%2C%22label%22%3A%22Median%22%2C%22chartLabel%22%3A%22Median%22%2C%22themeColor%22%3A%22infographicE%22%7D%5D%7D%7D%5D&search=${layerId}&date=${date}&dateCompare=${compareDate}`;
  console.log(url);

  return (
      <LinkButton onClick={() => { window.open(url) }}>
          Open in Full Map <CollecticonArrowUpRight />
      </LinkButton>
  );
}

export const LinkAttribution = styled(LinkAttributionCmp)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

LinkAttributionCmp.propTypes = {
  datasetId: T.string,
  layerId: T.string,
  date: T.string,
  compareDate: T.string,
  position:  T.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
};