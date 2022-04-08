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

const PageLoadingSelf = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
  height: 100vh;
  padding: ${variableGlsp()};
  background: ${themeVal('color.surface')};

  > div {
    background: ${themeVal('color.base-100')};
    animation: ${pulse} 0.8s ease 0s infinite alternate;
  }

  > div:nth-child(1) {
    height: 10%;
  }

  > div:nth-child(2) {
    height: 25%;
  }

  > div:nth-child(3) {
    flex-grow: 1;
  }

  p {
    ${visuallyHidden()}
  }
`;

function PageLoading() {
  return (
    <PageLoadingSelf>
      <div />
      <div />
      <div />
      <p>Loading contents...</p>
    </PageLoadingSelf>
  );
}

export default PageLoading;
