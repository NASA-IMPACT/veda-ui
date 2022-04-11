import React from 'react';
import styled, { keyframes } from 'styled-components';

import { themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const ContentLoadingSelf = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 24vh);
  gap: ${variableGlsp()};
  padding: ${variableGlsp()};
  background: ${themeVal('color.surface')};

  > div {
    background: ${themeVal('color.base-100')};
    animation: ${pulse} 0.8s ease 0s infinite alternate;
  }

  > div:nth-child(1) {
    grid-column: 1 / span 1;
  }

  > div:nth-child(2) {
    grid-column: 2 / span 3;
  }

  > div:nth-child(3) {
    grid-column: 1 / span 3;
    grid-row: 2;
  }

  > div:nth-child(4) {
    grid-column: 4 / span 1;
    grid-row: 2;
  }

  p {
    ${visuallyHidden()}
  }
`;

function ContentLoading() {
  return (
    <ContentLoadingSelf>
      <div />
      <div />
      <div />
      <div />
      <p>Loading contents...</p>
    </ContentLoadingSelf>
  );
}

export default ContentLoading;
