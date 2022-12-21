import React from 'react';
import T from 'prop-types';

import styled from 'styled-components';
import { glsp, media, themeVal } from '@devseed-ui/theme-provider';

import { variableGlsp } from '$styles/variable-utils';
import { VarHeading, VarLead, VarProse } from '$styles/variable-components';
import Constrainer from '$styles/constrainer';

const FoldProseSelf = styled.div`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};

  & + & {
    padding-top: 0;
  }
`;

const FoldInner = styled(Constrainer)`
  /* styled-component */
`;

export const FoldHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp()};
  justify-content: space-between;
  align-items: flex-end;

  > a {
    flex-shrink: 0;
  }
`;

export const FoldHeadline = styled.div`
  /* styled-component */
`;

export const FoldHeadActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp(0.5)};
`;

export const FoldHGroup = styled.div`
  gap: ${variableGlsp(0.125)};
`;

export const FoldTitle = styled(VarHeading).attrs({
  as: 'h2',
  size: 'large'
})`
  column-span: all;
  max-width: 52rem;
  display: flex;
  flex-direction: column;
  gap: calc(${glsp()} - ${glsp(0.25)});

  &::before {
    content: '';
    width: ${glsp(2)};
    height: ${glsp(0.25)};
    border-radius: ${themeVal('shape.rounded')};
    background: ${themeVal('color.primary')};
  }
`;

export const FoldLead = styled(VarLead)`
  color: inherit;
`;

export const FoldBody = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
`;

const Content = styled(VarProse)`
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
