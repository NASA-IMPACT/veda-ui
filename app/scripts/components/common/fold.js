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

function FoldProse(props) {
const { children } = props;

  return (
    <FoldProseSelf>
      <FoldInner>
        <Content>{children}</Content>
      </FoldInner>
    </FoldProseSelf>
  );
}

export default FoldProse;

FoldProse.propTypes = {
  children: T.node
};
