import React from 'react';
import T from 'prop-types';

import styled from 'styled-components';
import { media } from '@devseed-ui/theme-provider';
import { Prose } from '@devseed-ui/typography';

import { variableGlsp } from '../../styles/variable-utils';
import Constrainer from '../../styles/constrainer';

const FoldProseSelf = styled.div`
  padding: ${variableGlsp(2, 1)};
`;

const FoldInner = styled(Constrainer)`
  /* styled-component */
`;

const Content = styled(Prose)`
  grid-column: 1 / span 4;

  ${media.mediumUp`
    grid-column: 2 / span 6;
  `}

  ${media.largeUp`
    grid-column: 3 / span 8;
  `}
`;

function FoldComponent(props) {
  const { children, ...rest } = props;

  return (
    <FoldProseSelf {...rest}>
      <FoldInner>{children}</FoldInner>
    </FoldProseSelf>
  );
}

FoldComponent.propTypes = {
  children: T.node
};

export const Fold = styled(FoldComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

export function FoldProse(props) {
  const { children } = props;

  return (
    <FoldProseSelf>
      <FoldInner>
        <Content>{children}</Content>
      </FoldInner>
    </FoldProseSelf>
  );
}

FoldProse.propTypes = {
  children: T.node
};
